import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import CityState from "../../constants/CityState.json";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import { Field, Formik, ErrorMessage, FieldArray } from "formik";
import data from "../NewJson";
import {floornumber} from "../NewJson";
import {
  schemaLeadAddress,
  schemaLeadInfo,
  schemaLeadPersonalInfo,
} from "../common/ValidateSchemaHelper";
import { leadAddressInitialValues } from "../common/InitialValuesHelper";
import { Step, StepLabel, Stepper } from "@material-ui/core";

const LeadEdit = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lead, setLead] = useState(location.state ? location.state : {});
  const [stateList, setStateList] = useState(false);
  const [cityList, setCityList] = useState();
  const [currentSection, setCurrentSection] = useState(1);
  const [ownerList, setownerList] = useState([]);
  const [removeIndex, setRemoveIndex] = useState([]);
  const [defaultOwner, setDefaultOwner] = useState([]);
  const [typeOfClient, setTypeOfClient] = useState([lead.typeofclient]);
  const [transcationType, setTranscationType] = useState([
    lead.transactiontype,
  ]);
  const [verticals, setVertical] = useState([lead.vertical]);
  const [verticalType, setVerticalType] = useState([lead.verticaltype]);
  const [subVerticalType, setSubVerticalType] = useState([
    lead.subverticaltype,
  ]);
  const [stepperStep, setStepperStep] = useState("");

  useEffect(() => {
    var temp = [];
    CityState.map((ele) => {
      if (!temp.includes(ele.state)) {
        temp.push(ele.state);
      }
    });
    setStateList(temp.sort());

    var tempList = CityState.filter(
      (ele) => ele.state === (lead.clientstate)
    );
    setCityList(tempList.sort());

    async function init() {
      const result = await inventoryApi.fetchUsers();
      if (result) {
        setownerList(result);
        if (lead.id) {
          setDefaultOwner([{ id: lead.ownerid, username: lead.ownername }]);
        } else {
          setDefaultOwner([{ id: "", username: "" }]);
        }
      }
    }
    init();
  }, []);

  useEffect(() => {
    setTranscationType(data.Value["Transaction type"]);
    if (lead.transactiontype && lead.transactiontype !== "") {
      const temp = [];
      for (const [key, value] of Object.entries(
        data.Dependency[lead.transactiontype]
      )) {
        temp.push(key);
      }
      setTypeOfClient(temp);
    }
    if (
      lead.transactiontype &&
      lead.typeofclient !== "" &&
      lead.transactiontype !== ""
    ) {
      const temp = [];
      for (const [key, value] of Object.entries(
        data.Dependency[lead.transactiontype][lead.typeofclient]
      )) {
        temp.push(key);
      }
      setVertical(temp);
    }
    if (
      lead.transactiontype &&
      lead.typeofclient !== "" &&
      lead.vertical !== "" &&
      lead.transactiontype !== ""
    ) {
      const temp = [];
      for (const [key, value] of Object.entries(
        data.Dependency[lead.transactiontype][lead.typeofclient][lead.vertical]
      )) {
        temp.push(key);
      }
      setVerticalType(temp);
    }
    if (
      lead.transactiontype &&
      lead.typeofclient !== "" &&
      lead.verticaltype !== "" &&
      lead.vertical &&
      lead.transactiontype !== ""
    ) {
      const temp = [];
      for (const [key, value] of Object.entries(
        data.Dependency[lead.transactiontype][lead.typeofclient][lead.vertical][
          lead.verticaltype
        ]
      )) {
        temp.push(key);
      }
      setSubVerticalType(temp);
    }
  }, []);

  const handleBack = () => {
    setCurrentSection(currentSection - 1);
  };
  let nextResult = {};

  const handleSubmitSave = async (values) => {
    for (const key in values) {
      if (values[key] === undefined || values[key] === null) {
        values[key] = "";
      }
    }
    if (stepperStep !== "" && currentSection === 1) {
      setCurrentSection(stepperStep);
    } else if (stepperStep !== "" && currentSection === 2) {
      setCurrentSection(stepperStep);
    } else {
      if (!lead.id) {
        let result = await inventoryApi.createLead(values);
        if (result) {
          setLead(result);
          navigate(`/leads/${result.id}`, { state: result });
        }
      } else if (lead.id) {
        if (removeIndex.length > 0) {
          let deletAarea = await inventoryApi.deletePropertyAreadetails(
            removeIndex
          );
        }
        values.id = lead.id;
        let result = await inventoryApi.saveLead(values);
        if (result) {
          navigate(`/leads/${values.id}`, { state: values });
        }
      }
    }
  };

  const handleCancel = () => {
    if (lead.id) {
      navigate("/leads/" + lead.id, { state: lead });
    } else {
      navigate("/leads/");
    }
  };

  const steps = [
    { title: <span style={{ fontWeight: "bold" }}>Client Information</span> },
    { title: <span style={{ fontWeight: "bold" }}>Lead Information</span> },
    { title: <span style={{ fontWeight: "bold" }}>Review And Confirm</span> },
  ];

  return (
    <>
      <Container className="view-form inputbox">
        {location?.state?.id ? (
          <CustomSeparator
            cmpListName="Leads"
            cmpViewName={lead.firstname + " " + lead.lastname}
            currentCmpName="Edit"
            indexLength="2"
            indexViewLength="3"
            cmpViewUrl={"/leads/" + lead.id}
            url="/leads"
          ></CustomSeparator>
        ) : (
          <CustomSeparator
            cmpListName="Leads"
            currentCmpName="Create"
            indexLength="2"
            url="/leads"
          ></CustomSeparator>
        )}

        <Row className="mt-4 mx-2">
          <Col lg={12} className="ibs-form-section">
            <Col lg={12} className="ibs-form-section">
              <Formik
                validationSchema={
                  currentSection === 1
                    ? schemaLeadPersonalInfo()
                    : currentSection === 2
                    ? schemaLeadInfo()
                    : schemaLeadAddress()
                }
                initialValues={leadAddressInitialValues(lead)}
                onSubmit={handleSubmitSave}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  setFieldValue,
                  touched,
                  errors,
                }) => (
                  <>
                    {currentSection === 1 && (
                      <Form onSubmit={handleSubmit}>
                        <Row className="view-form-header align-items-center">
                          <Col lg={10}>
                            {lead.id ? (
                              <>
                                <b>Edit Lead</b>
                                <h4>{lead.firstname + " " + lead.lastname}</h4>
                              </>
                            ) : (
                              <h6 style={{ marginTop: "5px" }}>New Lead</h6>
                            )}
                          </Col>
                          <Col
                            lg={2}
                            className="d-flex flex-col justify-content-end align-items-end"
                          >
                            <Button
                              className="btn-sm mx-2"
                              variant="danger"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="btn-sm mx-2"
                              //onClick={handleSubmit}
                              onClick={() => {
                                setStepperStep(currentSection + 1);
                                handleSubmit();
                              }}
                            >
                              Next
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <Row>
                              <Col lg={12}>
                                <Stepper activeStep={currentSection - 1}>
                                  {steps.map((step, index) => (
                                    <Step key={index}>
                                      <StepLabel
                                        onClick={() => {
                                          setStepperStep(index + 1);
                                          handleSubmit();
                                        }}
                                      >
                                        {step.title}
                                      </StepLabel>
                                    </Step>
                                  ))}
                                </Stepper>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        {currentSection === 1 && (
                          <Row lg={12} className="section-header">
                            <Col lg={10}>
                              <h5 style={{ marginTop: "5px" }}>
                                Client Information
                              </h5>
                            </Col>
                          </Row>
                        )}
                        <Row>
                          <Col lg={3}>
                            <label>
                              Salutation<b class="red-star"></b>
                            </label>
                            <Field
                              className="custom-input"
                              as="select"
                              name="salutation"
                              value={values.salutation}
                              onChange={handleChange}
                            >
                              <option value="">--Select--</option>
                              <option value="Mr">Mr.</option>
                              <option value="Mrs">Mrs.</option>
                              <option value="Ms">Ms.</option>
                              <option value="Dr">Dr.</option>
                              <option value="Prof">Prof.</option>
                            </Field>
                          </Col>
                          <Col lg={3}>
                            <label>
                              First Name <b class="red-star">*</b>
                            </label>
                            <Field
                              className="custom-input"
                              type="text"
                              name="firstname"
                              placeholder="Enter firstname"
                              style={{ textTransform: "capitalize" }}
                              value={values.firstname}
                              onChange={(e) => {
                                const formattedValue =
                                  e.target.value.charAt(0).toUpperCase() +
                                  e.target.value.slice(1).toLowerCase();
                                setFieldValue("firstname", formattedValue);
                              }}
                              required
                            />
                            <ErrorMessage
                              name="firstname"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>
                              Last Name<b class="red-star">*</b>
                            </label>
                            <Field
                              className="custom-input"
                              type="text"
                              name="lastname"
                              style={{ textTransform: "capitalize" }}
                              value={values.lastname}
                              placeholder="Enter lastname"
                              required
                              onChange={(e) => {
                                const formattedValue =
                                  e.target.value.charAt(0).toUpperCase() +
                                  e.target.value.slice(1).toLowerCase();
                                setFieldValue("lastname", formattedValue);
                              }}
                            />
                            <ErrorMessage
                              name="lastname"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>Designation</label>
                            <Field
                              className="custom-input"
                              type="text"
                              name="designation"
                              style={{ textTransform: "capitalize" }}
                              value={values.designation}
                              onChange={handleChange}
                              placeholder="Enter designation"
                              required
                            />
                            <ErrorMessage
                              name="designation"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>
                              Phone
                              <b class="red-star"></b>
                            </label>
                            <Field
                              className="custom-input"
                              type="number"
                              name="phone"
                              placeholder="Enter phone number"
                              value={values.phone}
                              onChange={handleChange}
                              required
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>Email </label>
                            <Field
                              //style={{ textTransform: "lowercase" }}
                              className="custom-input"
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              value={values.email}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="error-message"
                            />
                          </Col>

                          <Col lg={3}>
                            <label>Lead Source</label>
                            <Field
                              type="text"
                              name="leadsource"
                              placeholder="Enter Lead Source"
                              value={values.leadsource}
                            ></Field>
                          </Col>

                          <Col lg={3}>
                            <label>
                              Stage<b class="red-star"></b>
                            </label>
                            <Field
                              as="select"
                              name="leadstage"
                              onChange={handleChange}
                              value={values.leadstage}
                              required
                            >
                              <option value="Open">Open</option>
                              <option value="Close">Close</option>
                              <option value="Pending">Pending</option>
                              <option value="Negotiation Stage">
                                Negotiation Stage
                              </option>
                              <option value="Due Diligence Stage">
                                Due Diligence Stage{" "}
                              </option>
                              <option value="Upload File Stage">
                                Upload File Stage
                              </option>
                              <option value="Tenure">Tenure</option>
                              <option value="Neighboring Brands">
                                Neighboring Brands
                              </option>
                              {/* <option value="Stamp Duty">Stamp Duty</option>
                              <option value="Registration Cost">
                                Registration Cost
                              </option> */}
                              {/* <option value="Maintenance Charges">
                                Maintenance Charges
                              </option> */}
                              {/* <option value="Possession Timeline">
                                Possession Timeline
                              </option> */}
                            </Field>
                            <ErrorMessage
                              name="leadstage"
                              component="div"
                              className="error-message"
                            />
                          </Col>

                          <Col lg={3}>
                            <label>Alternate Phone</label>
                            <Field
                              className="custom-input"
                              type="number"
                              name="alternatephone"
                              placeholder="Enter alternatephone number"
                              value={values.alternatephone}
                              onChange={handleChange}
                              required
                            />
                            <ErrorMessage
                              name="alternatephone"
                              component="div"
                              className="error-message"
                            />
                          </Col>

                          <Col lg={3}>
                            <label>Client Type </label>
                            <Field
                              as="select"
                              value={values.clienttype}
                              name="clienttype"
                              onChange={handleChange}
                            >
                              <option value="">Select Type</option>
                              <option value="Owner">Owner</option>
                              <option value="Company">Company</option>
                              <option value="Individual">Individual</option>
                            </Field>
                          </Col>

                          <Col lg={3}>
                            <label>Company</label>
                            <Field
                              type="text"
                              name="company"
                              placeholder="Enter company"
                              value={values.company}
                              onChange={handleChange}
                            ></Field>
                          </Col>
                          <Col lg={3}>
                            <label>Office Address </label>
                            <Field
                              type="text"
                              name="office"
                              placeholder="Enter Office Address"
                              value={values.office}
                              onChange={handleChange}
                            ></Field>
                          </Col>
                          <Col lg={3}>
                            <label>
                              Assign Staff<b class="red-star"> *</b>
                            </label>
                            <Field
                              as="select"
                              name="ownerid"
                              value={values.ownerid}
                              defaultValue={defaultOwner}
                              onChange={handleChange}
                              required
                            >
                              <option value="">--Select Assign Staff--</option>
                              {ownerList &&
                                ownerList.map((ele) => (
                                  <option value={ele.id}>{ele.username}</option>
                                ))}
                            </Field>

                            <ErrorMessage
                              name="ownerid"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                        </Row>

                        <Row lg={12} className="section-header">
                          <Col lg={7}>
                            <h5 style={{ marginTop: "5px" }}>
                              Address Information
                            </h5>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={3}>
                            <label>State</label>
                            <Field
                              as="select"
                              name="clientstate"
                              value={values.clientstate}
                              onChange={(event) => {
                                var temp = CityState.filter(
                                  (ele) => ele.state === event.target.value
                                );
                                setCityList(temp.sort());
                                handleChange(event);
                              }}
                            >
                              <option value="">--Select State--</option>
                              {stateList &&
                                stateList.map((state) => (
                                  <option value={state}>{state}</option>
                                ))}
                            </Field>
                          </Col>
                          <Col lg={3}>
                            <label>City</label>
                            <Field
                              as="select"
                              name="clientcity"
                              value={values.clientcity}
                              onChange={handleChange}
                            >
                              <option value="">--Select City--</option>
                              {cityList &&
                                cityList.map((ele) => (
                                  <option value={ele.name}>{ele.name}</option>
                                ))}
                            </Field>
                          </Col>
                          <Col lg={3}>
                            <label>Street</label>
                            <Field
                              className=""
                              type="text"
                              name="clientstreet"
                              placeholder="Enter street"
                              value={values.clientstreet}
                              onChange={handleChange}
                            />
                          </Col>
                          <Col lg={3}>
                            <label> Pincode </label>
                            <Field
                              className=" no-arrows"
                              type="number"
                              name="clientpincode"
                              placeholder="Enter pincode"
                              value={values.clientpincode}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="clientpincode"
                              component="div"
                              className="error-message"
                            />
                          </Col>

                          <Col lg={3}>
                            <label>Country </label>
                            <Field
                              className=""
                              type="text"
                              name="clientcountry"
                              defaultValue={"India"}
                              value={values.clientcountry}
                              onChange={handleChange}
                            />
                          </Col>

                          <Col lg={3}>
                            <label> Zone </label>
                            <Field
                              as="select"
                              value={values.zone}
                              name="zone"
                              onChange={handleChange}
                            >
                              <option value="">--Select Zone--</option>
                              <option value="North">North</option>
                              <option value="East">East</option>
                              <option value="South">South</option>
                              <option value="West">West</option>
                            </Field>
                          </Col>

                          <Col lg={3}>
                            <label>
                              Third Party<b class="red-star"></b>
                            </label>
                            <Field
                              type="checkbox"
                              name="clientcalloption"
                              defaultChecked={false}
                              checked={values.clientcalloption}
                              onChange={(e) => {
                                setFieldValue(
                                  "clientcalloption",
                                  e.target.checked
                                );
                                handleChange(e);
                              }}
                            />
                          </Col>
                        </Row>

                        {values.clientcalloption &&
                        values.clientcalloption === true ? (
                          <>
                            <Row lg={12} className="section-header">
                              <Col lg={7}>
                                <h5 style={{ marginTop: "5px" }}>
                                  Third Party Information
                                </h5>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={3}>
                                <label>
                                  {" "}
                                  Name <b class="red-star">*</b>
                                </label>
                                <Field
                                  type="text"
                                  name="clientcalloptionname"
                                  placeholder="Enter Name"
                                  value={values.clientcalloptionname}
                                  onChange={handleChange}
                                />
                                <ErrorMessage
                                  name="clientcalloptionname"
                                  component="div"
                                  className="error-message"
                                />
                              </Col>

                              <Col lg={3}>
                                <label>
                                  Mobile
                                  <b class="red-star"></b>
                                </label>
                                <Field
                                  className="custom-input"
                                  type="number"
                                  name="clientcalloptionmobile"
                                  placeholder="Enter mobile number"
                                  value={values.clientcalloptionmobile}
                                  onChange={handleChange}
                                  required
                                />
                                <ErrorMessage
                                  name="clientcalloptionmobile"
                                  component="div"
                                  className="error-message"
                                />
                              </Col>
                              <Col lg={3}>
                                <label>Email </label>
                                <Field
                                  // style={{ textTransform: "lowercase" }}
                                  className="custom-input"
                                  type="email"
                                  name="clientcalloptionemail"
                                  placeholder="Enter Email"
                                  value={values.clientcalloptionemail}
                                  onChange={handleChange}
                                />
                                <ErrorMessage
                                  name="clientcalloptionemail"
                                  component="div"
                                  className="error-message"
                                />
                              </Col>

                              <Col lg={3}>
                                <label>Date</label>
                                <Field
                                  className="custom-input"
                                  type="date"
                                  name="clientcalloptiondate"
                                  placeholder="Enter date"
                                  value={values.clientcalloptiondate}
                                  onChange={handleChange}
                                  required
                                />
                                <ErrorMessage
                                  name="clientcalloptiondate"
                                  component="div"
                                  className="error-message"
                                />
                              </Col>
                              <Col lg={3}>
                                <label>Remarks</label>
                                <Field
                                  type="text"
                                  name="clientcalloptionremark"
                                  placeholder="Enter Remarks"
                                  value={values.clientcalloptionremark}
                                ></Field>
                              </Col>
                              <Col lg={3}>
                                <label> Rate/Sq.Ft.</label>
                                <Field
                                  type="number"
                                  name="clientcalloptionratepersqfeet"
                                  placeholder="Enter Rate/Sq.Ft"
                                  value={values.clientcalloptionratepersqfeet}
                                />
                                <ErrorMessage
                                  name="clientcalloptionratepersqfeet"
                                  component="div"
                                  className="error-message"
                                />
                              </Col>
                              <Col lg={3}>
                                <label>Brokerage</label>
                                <Field
                                  type="text"
                                  name="clientcalloptionbrokerage"
                                  placeholder="Enter Brokerage"
                                  value={values.clientcalloptionbrokerage}
                                ></Field>
                              </Col>
                              {/* <Col lg={3}>
                                          <label>Third Party</label>
                                          <Field
                                            as="select"
                                            name="thirdparty"
                                            placeholder="Enter Third party"
                                            value={values.thirdparty}
                                          >
                                            <option>--Third Party--</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Field>
                                        </Col> */}
                            </Row>
                          </>
                        ) : (
                          ""
                        )}
                      </Form>
                    )}
                    {currentSection === 2 && (
                      <Form onSubmit={handleSubmit}>
                        <Row className="view-form-header align-items-center">
                          <Col lg={8}>
                            {lead.id ? (
                              <>
                                <b>Edit Lead</b>
                                <h4>{lead.firstname + " " + lead.lastname}</h4>
                              </>
                            ) : (
                              "New Lead"
                            )}
                          </Col>
                          <Col
                            lg={4}
                            className="d-flex flex-col justify-content-end align-items-end"
                          >
                            <Button
                              className="btn-sm mx-2"
                              onClick={handleBack}
                            >
                              Back
                            </Button>{" "}
                            &nbsp;
                            <Button
                              className="btn-sm mx-2"
                              // onClick={handleSubmit}
                              onClick={() => {
                                setStepperStep(currentSection + 1);
                                handleSubmit();
                              }}
                            >
                              Next
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <Stepper activeStep={currentSection - 1}>
                              {steps.map((step, index) => (
                                <Step key={index}>
                                  <StepLabel
                                    onClick={() => {
                                      setStepperStep(index + 1);
                                      handleSubmit();
                                    }}
                                  >
                                    {step.title}
                                  </StepLabel>
                                </Step>
                              ))}
                            </Stepper>
                          </Col>
                        </Row>

                        <Row lg={12} className="section-header">
                          <Col lg={8}>
                            <h5 style={{ marginTop: "5px" }}>
                              Lead Information
                            </h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3}>
                            <label>Transaction Type</label>
                            <Field
                              className="Field"
                              as="select"
                              name="transactiontype "
                              value={values.transactiontype}
                              onChange={(e) => {
                                setFieldValue(
                                  "transactiontype",
                                  e.target.value
                                );
                                setFieldValue("typeofclient", "");
                                setFieldValue("vertical", "");
                                setFieldValue("verticaltype", "");
                                setFieldValue("subverticaltype", "");
                                const temp = [];
                                if (e.target.value !== "") {
                                  if (
                                    Object.entries(
                                      data.Dependency[e.target.value]
                                    ).length > 0
                                  ) {
                                    for (const [key, value] of Object.entries(
                                      data.Dependency[e.target.value]
                                    )) {
                                      temp.push(key);
                                    }
                                    setTypeOfClient(temp);
                                  } else {
                                    setTypeOfClient(
                                      data.Value["Type of client"]
                                    );
                                  }
                                } else {
                                  setTypeOfClient([]);
                                }
                              }}
                            >
                              <option value="">--Select--</option>
                              {transcationType &&
                                transcationType.map((value) => (
                                  <option value={value}>{value}</option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="transactiontype"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>Type Of Client</label>
                            <Field
                              className="Field"
                              disabled={!values.transactiontype}
                              as="select"
                              name="typeofclient"
                              value={values.typeofclient}
                              onChange={(e) => {
                                setFieldValue("typeofclient", e.target.value);
                                setFieldValue("vertical", "");
                                setFieldValue("verticaltype", "");
                                setFieldValue("subverticaltype", "");
                                const temp = [];
                                if (e.target.value !== "") {
                                  if (
                                    Object.entries(
                                      data.Dependency[values.transactiontype]
                                    ).length > 0
                                  ) {
                                    for (const [key, value] of Object.entries(
                                      data.Dependency[values.transactiontype][
                                        e.target.value
                                      ]
                                    )) {
                                      temp.push(key);
                                    }
                                    setVertical(temp);
                                  } else {
                                    setVertical(data.Value["Vertical"]);
                                  }
                                } else {
                                  setVertical([]);
                                }
                              }}
                            >
                              <option value="">--Select--</option>
                              {typeOfClient.length > 0 &&
                                typeOfClient.map((value) => (
                                  <option value={value}>{value}</option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="typeofclient"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>Vertical In Property</label>
                            <Field
                              className="Field"
                              disabled={!values.typeofclient}
                              as="select"
                              name="vertical"
                              value={values.vertical}
                              onChange={(e) => {
                                setFieldValue("vertical", e.target.value);
                                setFieldValue("verticaltype", "");
                                setFieldValue("subverticaltype", "");

                                if (e.target.value !== "") {
                                  if (
                                    Object.entries(
                                      data.Dependency[values.transactiontype]
                                    ).length > 0
                                  ) {
                                    const temp = [];
                                    for (const [key, value] of Object.entries(
                                      data.Dependency[values.transactiontype][
                                        values.typeofclient
                                      ][e.target.value]
                                    )) {
                                      temp.push(key);
                                    }
                                    setVerticalType(temp);
                                  } else {
                                    setVerticalType(
                                      data.Value["Vertical-type"]
                                    );
                                  }
                                } else {
                                  setVerticalType([]);
                                }
                              }}
                            >
                              <option value="">--Select--</option>
                              {verticals &&
                                verticals.map((value) => (
                                  <option value={value}>{value}</option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="vertical"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>Vertical Type</label>
                            <Field
                              disabled={!values.vertical}
                              className="Field"
                              as="select"
                              name="verticaltype"
                              value={values.verticaltype}
                              onChange={(e) => {
                                setFieldValue("verticaltype", e.target.value);
                                setFieldValue("subverticaltype", "");

                                        if (e.target.value !== "") {
                                          if (
                                            Object.entries(
                                              data.Dependency[
                                                values.transactiontype
                                              ]
                                            ).length > 0
                                          ) {
                                            const temp = [];
                                            for (const [
                                              key,
                                              value,
                                            ] of Object.entries(
                                              data.Dependency[
                                                values.transactiontype
                                              ][values.typeofclient][
                                                values.vertical
                                              ][e.target.value]
                                            )) {
                                              temp.push(...value);
                                            }
                                            setSubVerticalType(temp);
                                          } else {
                                            setSubVerticalType(
                                              data.Value["Sub vertical type"]
                                            );
                                          }
                                        } else {
                                          setSubVerticalType([]);
                                        }
                                      }}
                                    >
                                      <option value="">--Select--</option>
                                      {verticalType &&
                                        verticalType.map((value) => (
                                          <option value={value}>{value}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                      name="verticaltype"
                                      component="div"
                                      className="error-message"
                                    />
                                  </Col>
                                  <Col lg={3}>
                                    <label>Sub Vertical Type</label>
                                    <Field
                                      disabled={!values.verticaltype}
                                      className="Field"
                                      as="select"
                                      name="subverticaltype"
                                      value={values.subverticaltype}
                                      onChange={(e) =>
                                        setFieldValue(
                                          "subverticaltype",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">--Select--</option>
                                      {subVerticalType &&
                                        subVerticalType.map((value) => (
                                          <>
                                          <option value={value}>{value}</option>
                                          </>
                                        ))}
                                        <option value="Ready to Move">Ready to Move</option>
                                        <option value='BTS'>BTS</option>
                                        <option value='Under Construction'>Under Construction</option>
                                    </Field>
                                    <ErrorMessage
                                      name="subverticaltype"
                                      component="div"
                                      className="error-message"
                                    />
                                  </Col>
                                  {/* <Col lg={6}>
                                if (e.target.value !== "") {
                                  if (
                                    Object.entries(
                                      data.Dependency[values.transactiontype]
                                    ).length > 0
                                  ) {
                                    const temp = [];
                                    for (const [key, value] of Object.entries(
                                      data.Dependency[values.transactiontype][
                                        values.typeofclient
                                      ][values.vertical][e.target.value]
                                    )) {
                                      temp.push(...value);
                                    }
                                    setSubVerticalType(temp);
                                  } else {
                                    setSubVerticalType(
                                      data.Value["Sub vertical type"]
                                    );
                                  }
                                } else {
                                  setSubVerticalType([]);
                                }
                              }}
                            >
                              <option value="">--Select--</option>
                              {verticalType &&
                                verticalType.map((value) => (
                                  <option value={value}>{value}</option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="verticaltype"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          <Col lg={3}>
                            <label>Sub Vertical Type</label>
                            <Field
                              disabled={!values.verticaltype}
                              className="Field"
                              as="select"
                              name="subverticaltype"
                              value={values.subverticaltype}
                              onChange={(e) =>
                                setFieldValue("subverticaltype", e.target.value)
                              }
                            >
                              <option value="">--Select--</option>
                              {subVerticalType &&
                                subVerticalType.map((value) => (
                                  <option value={value}>{value}</option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="subverticaltype"
                              component="div"
                              className="error-message"
                            />
                          </Col>
                          {/* <Col lg={6}>
                                  <label>Area / From / To</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      as="select"
                                      name="areavaluein"
                                      placeholder="Enter Area"
                                      value={values.areavaluein}
                                      onChange={handleChange}
                                    >
                                      <option value="">--Select--</option>
                                      <option value="Gaj">Gaj</option>
                                      <option value="Sq.feet">Sq.feet</option>
                                      <option value="Yards">Yards</option>
                                      <option value="Sq. yards">
                                        Sq. yards
                                      </option>
                                      <option value="Sq. Meter">
                                        Sq. Meter
                                      </option>
                                    </Field>
                                    <Field
                                      type="number"
                                      name="areafrom"
                                      placeholder="Enter from"
                                      value={values.areafrom}
                                      onChange={handleChange}
                                    />
                                  
                                    <Field
                                      type="number"
                                      name="areato"
                                      placeholder="Enter to"
                                      value={values.areato}
                                      onChange={handleChange}
                                    />
                                  
                                  </div>
                                  { ((touched.areavaluein && errors.areavaluein )  || (errors.areafrom && touched.areafrom) || (errors.areato && touched.areato) ) &&
                                  <div className="error-message">{(errors.areavaluein  || errors.areafrom || errors.areato )}</div>
                                  }
                                </Col> */}

                          {values.vertical === 'Retail' ?<Col lg={3}>
                            <label>Retail  Sub Vertical</label>
                            <Field
                              type="text"
                              name="retailsubvertical"
                              placeholder="Enter Retail  Sub Vertical"
                              value={values.retailsubvertical}
                            ></Field>
                          </Col> :''}
                          <Col lg={3}>
                            <label># of Car/ Truck Parking</label>
                            <Field
                              type="number"
                              name="numberofcarortruckparking"
                              placeholder="Enter # of Car/ Truck Parking"
                              value={values.numberofcarortruckparking}
                            ></Field>
                          </Col>
                          <Col lg={3}>
                            <label>Type</label>
                            <Field
                              as="select"
                              name="type"
                              value={values.type}
                              onChange={handleChange}
                            >
                              <option value="">---Select type---</option>
                              <option value="BTS">BTS</option>
                              <option value="ready">Ready</option>
                              <option value="consultant">consultant</option>
                              <option value=" ciril member"> ciril member</option>
                              <option value="under construction">
                                Under Construction
                              </option>
                            </Field>
                          </Col>

                          <Col lg={3}>
                            <label>Other Details</label>
                            <Field
                              className="Field"
                              type="text"
                              placeholder="Enter other details"
                              name="otherdetails"
                              value={values.otherdetails}
                            ></Field>
                          </Col>
                          <Col lg={3}>
                            <label>Other Locations</label>
                            <Field
                              className="Field"
                              type="text"
                              placeholder="Enter other locations"
                              name="otherlocations"
                              value={values.otherlocations}
                            />
                          </Col>

                          {/* <Col lg={6}>
                                  <label>Budget Range from and To</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      as="select"
                                      name="budgetrangein"
                                      value={values.budgetrangein}
                                    >
                                      <option value=''>Select Budget Range from and To </option>
                                      <option value="crores">Crores</option>
                                      <option value="lacs">Lacs</option>
                                    </Field>

                                    <Field
                                      as="select"
                                      name="budgetrangefrom"
                                      placeholder="Select Budget Range from "
                                      value={values.budgetrangefrom}
                                      onChange={handleChange}
                                    >
                                      <option value=''>--Select Budget Range--</option>
                                      <option value="1">1</option>
                                      <option value="10">10</option>
                                      <option value="20">20</option>
                                      <option value="30">30</option>
                                      <option value="40">40</option>
                                      <option value="50">50</option>
                                      <option value="60">60</option>
                                      <option value="70">70</option>
                                      <option value="80">80</option>
                                      <option value="90">90</option>
                                    </Field>
                                    <Field
                                      as="select"
                                      name="budgetrangeto"
                                      placeholder="Select Budget Range To"
                                      value={values.budgetrangeto}
                                      onChange={handleChange}
                                    >
                                      <option value=''>--Select Budget Range--</option>
                                      <option value="10">10</option>
                                      <option value="20">20</option>
                                      <option value="30">30</option>
                                      <option value="40">40</option>
                                      <option value="50">50</option>
                                      <option value="60">60</option>
                                      <option value="70">70</option>
                                      <option value="80">80</option>
                                      <option value="90">90</option>
                                      <option value="100 ">100</option>
                                    </Field>
                                  </div>
                                  { (touched.budgetrangein  || touched.budgetrangefrom || touched.budgetrangeto ) &&
                                  <div className="error-message">{(errors.budgetrangein  || errors.budgetrangefrom || errors.budgetrangeto )}</div>
                                  }
                                </Col> */}
                          {/* <Col lg={6}>
                                  <label>Height From and To</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      as="select"
                                      name="heightrangein"
                                      placeholder="Enter Height Range"
                                      value={values.heightrangein}
                                    >
                                      <option value="">Select Range</option>
                                      <option value="Cm">CM</option>
                                      <option value="Mtr">Mtrs</option>
                                    </Field>
                                    <Field
                                      type="number"
                                      name="heightfrom"
                                      placeholder="Enter Height from "
                                      value={values.heightfrom}
                                    />
                                      
                                    <Field
                                      type="number"
                                      name="heightto"
                                      placeholder="Enter Height  to"
                                      value={values.heightto}
                                    />
                                      
                                  </div>
                                  { (touched.heightrangein  || touched.heightfrom || touched.heightto ) &&
                                  <div className="error-message">{(errors.heightrangein  || errors.heightfrom || errors.heightto )}</div>
                                  }
                                </Col> */}
                          {/* <Col lg={3}>
                                  <label>Carpet Area</label>
                                  <Field
                                    type="number"
                                    name="carpetarea"
                                    placeholder="Enter Carpet Area"
                                    value={values.carpetarea}
                                  />
                                  <ErrorMessage
                                  name="carpetarea"
                                  component="div"
                                  className="error-message"
                                />
                                </Col> */}
                          {/* <Col lg={3}>
                                  <label>Floor From and To</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      type="number"
                                      name="floorfrom"
                                      placeholder="Enter Floor from "
                                      value={values.floorfrom}
                                    />
                                    <Field
                                      type="number"
                                      name="floorto"
                                      placeholder="Enter Floor  To"
                                      value={values.floorto}
                                    />
                                  </div>
                                  { (touched.floorfrom  || touched.floorto ) &&
                                  <div className="error-message">{(errors.floorfrom  || errors.floorto  )}</div>
                                  }
                                </Col> */}
                          <Col lg={3}>
                            <label>Completion Date</label>
                            <Field
                              type="date"
                              name="completiondate"
                              placeholder="Enter Completion Date"
                              value={values.completiondate}
                            ></Field>
                          </Col>

                          <Col lg={3}>
                            <label>Frontage</label>
                            <div className="d-flex w-80">
                              <Field
                                as="select"
                                name="frontage"
                                //placeholder="Enter Frontage"
                                value={values.frontage}
                              >
                                <option value="">Select</option>
                                <option value="ft.">Feet</option>
                                <option value="mtr.">Meter</option>
                              </Field>

                              <Field
                                className="mx-1"
                                type="number"
                                name="frontagein"
                                placeholder="Enter Frontage"
                                value={values.frontagein}
                              />
                            </div>
                            {(touched.frontagein || touched.frontage) && (
                              <div className="error-message">
                                {errors.frontage || errors.frontagein}
                              </div>
                            )}
                          </Col>

                          <Col lg={3}>
                            <label>Area/Location breif</label>
                            <Field
                              as="textarea"
                              className="textarea"
                              name="areaorlocationbrief"
                              placeholder="Enter Area/Location"
                              value={values.areaorlocationbrief}
                            ></Field>
                          </Col>

                          {values.verticaltype === "Warehousing" && (
                            <Row lg={12} className="section-header mx-auto">
                              <Col lg={6}>
                                <h5 style={{ marginTop: "5px" }}>
                                  Warehousing Details
                                </h5>
                              </Col>
                            </Row>
                          )}

                          {values.verticaltype === "Warehousing" ? (
                            <Col lg={3}>
                              <label>No. of Docks</label>
                              <div className="d-flex w-80">
                                <Field
                                  type="number"
                                  name="noofdocksvalue"
                                  placeholder="Enter value"
                                  value={values.noofdocksvalue}
                                  onChange={handleChange}
                                />
                              </div>
                              {touched.noofdocksvalue && (
                                <div className="error-message">
                                  {errors.noofdocksvalue}
                                </div>
                              )}
                            </Col>
                          ) : (
                            ""
                          )}

                          {values.verticaltype === "Warehousing" && (
                            <Col lg={3}>
                              <label>No. of Washrooms</label>
                              <div className="d-flex w-80">
                                <Field
                                  type="number"
                                  name="noofwashroomsvalue"
                                  placeholder="Enter value"
                                  value={values.noofwashroomsvalue}
                                />
                              </div>
                              {touched.noofwashroomsvalue && (
                                <div className="error-message">
                                  {errors.noofwashroomsvalue}
                                </div>
                              )}
                            </Col>
                          )}

                          {values.verticaltype === "Warehousing" && (
                            <Col lg={3}>
                              <label>Open Area</label>
                              <div className="d-flex w-80">
                                <Field
                                  as="select"
                                  name="openareaunit"
                                  placeholder="Enter Area"
                                  value={values.openareaunit}
                                  onChange={handleChange}
                                >
                                  <option value="">--Select--</option>
                                  <option value="Gaj">Gaj</option>
                                  <option value="Sq.feet">Sq.feet</option>
                                  <option value="Yards">Yards</option>
                                  <option value="Sq. yards">Sq. yards</option>
                                  <option value="Sq. Meter">Sq. Meter</option>
                                </Field>
                                <Field
                                  className="mx-1"
                                  type="text"
                                  name="openareavalue"
                                  placeholder="Enter value"
                                  value={values.openareavalue}
                                />
                              </div>
                              {(touched.openareaunit ||
                                touched.openareavalue) && (
                                <div className="error-message">
                                  {errors.openareaunit || errors.openareavalue}
                                </div>
                              )}
                            </Col>
                          )}

                          {values.verticaltype === "Warehousing" && (
                            <Col lg={3}>
                              <label>Close Area</label>
                              <div className="d-flex w-80">
                                <Field
                                  as="select"
                                  name="closeareaunit"
                                  placeholder="Enter close area unit"
                                  value={values.closeareaunit}
                                  onChange={handleChange}
                                >
                                  <option value="">--Select--</option>
                                  <option value="Gaj">Gaj</option>
                                  <option value="Sq.feet">Sq.feet</option>
                                  <option value="Yards">Yards</option>
                                  <option value="Sq. yards">Sq. yards</option>
                                  <option value="Sq. Meter">Sq. Meter</option>
                                </Field>
                                <Field
                                  className="mx-1"
                                  type="text"
                                  name="closeareavalue"
                                  placeholder="Enter value"
                                  value={values.closeareavalue}
                                />
                              </div>
                              {(touched.closeareaunit ||
                                touched.closeareavalue) && (
                                <div className="error-message">
                                  {errors.closeareaunit ||
                                    errors.closeareavalue}
                                </div>
                              )}
                            </Col>
                          )}

                          {values.verticaltype === "Warehousing" && (
                            <Col lg={3}>
                              <label>Rental</label>
                              <div className="d-flex w-80">
                                <Field
                                  as="select"
                                  name="rentalunit"
                                  placeholder="Enter unit"
                                  value={values.rentalunit}
                                  onChange={handleChange}
                                >
                                  <option value="">--Select--</option>
                                  <option value="Gaj">Gaj</option>
                                  <option value="Sq.feet">Sq.feet</option>
                                  <option value="Yards">Yards</option>
                                  <option value="Sq. yards">Sq. yards</option>
                                  <option value="Sq. Meter">Sq. Meter</option>
                                </Field>
                                <Field
                                  className="mx-1"
                                  type="text"
                                  name="rentalvalue"
                                  placeholder="Enter value"
                                  value={values.rentalvalue}
                                />
                              </div>
                              {(touched.rentalunit || touched.rentalvalue) && (
                                <div className="error-message">
                                  {errors.rentalunit || errors.rentalvalue}
                                </div>
                              )}
                            </Col>
                          )}

                          <Row></Row>

                          {/* <Col lg={3}>
                                <label>
                                Ac Manager Details<b class="red-star"></b>
                                </label>
                                <Field
                                  type="checkbox"
                                  name="acmanagerdetails"
                                  defaultChecked={false}
                                  checked={values.acmanagerdetails}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "acmanagerdetails",
                                      e.target.checked
                                    );
                                    handleChange(e);
                                  }}
                                />
                              </Col> */}
                          {/* {values.acmanagerdetails && values.acmanagerdetails === true ?<>
                                <Row>
                                <Col lg={3}>
                                  <label>Client <b class="red-star">*</b> </label>
                                  <Field
                                    type="text"
                                    name="client"
                                    placeholder="Enter client"
                                    value={values.client}
                                  ></Field>
                                   <ErrorMessage
                                 name="client"
                                 component="div"
                                 className="error-message"
                               />
                                </Col>

                                <Col lg={3}>
                                  <label>Il Id</label>
                                  <Field
                                    type="text"
                                    name="ilid"
                                    placeholder="Enter ilid"
                                    value={values.ilid}
                                  ></Field>
                                </Col>
                                <Col lg={3}>
                                  <label>Il Created Date</label>
                                  <Field
                                    type="date"
                                    name="ilcreateddate"
                                    placeholder="Enter il created date "
                                    value={values.ilcreateddate}
                                  ></Field>
                                </Col>
                                <Col lg={3}>
                                  <label>Il Closed Date</label>
                                  <Field
                                    type="date"
                                    name="ilcloseddate"
                                    placeholder="Enter Il closed date"
                                    value={values.ilcloseddate}
                                  ></Field>
                                </Col>

                                <Col lg={3}>
                                  <label>Actions</label>
                                  <Field
                                    type="text"
                                    name="actions"
                                    placeholder="Enter actions"
                                    value={values.actions}
                                  ></Field>
                                </Col>
                                <Col lg={3}>
                                  <label> A/c Manager Name</label>
                                  <Field
                                    type="text"
                                    name="acmanagername"
                                    placeholder="Enter  A/c Manager Name"
                                    value={values.acmanagername}
                                  ></Field>
                                   <ErrorMessage
                                  name="acmanagername"
                                  component="div"
                                  className="error-message"
                                />
                                </Col>
                                <Col lg={3}>
                                  <label>Member Office</label>
                                  <Field
                                    type="text"
                                    name="memberoffice"
                                    placeholder="Enter Member Office"
                                    value={values.memberoffice}
                                  ></Field>
                                </Col>
                                <Col lg={3}>
                                  <label> A/c Manager Email Id</label>
                                  <Field
                                    type="text"
                                    name="acmanageremail"
                                    placeholder="Enter A/c Manager Email id"
                                    value={values.acmanageremail}
                                  ></Field>
                                   <ErrorMessage
                                  name="acmanageremail"
                                  component="div"
                                  className="error-message"
                                />
                                </Col>
                                <Col lg={3}>
                                  <label> A/c Manager Phone</label>
                                  <Field
                                    type="number"
                                    name="acmanagerphone"
                                    placeholder="Enter A/c Manager Phone"
                                    value={values.acmanagerphone}
                                  ></Field>
                                   <ErrorMessage
                                  name="acmanagerphone"
                                  component="div"
                                  className="error-message"
                                />
                                </Col>
                                <Col lg={3}>
                                  <label>Comments</label>
                                  <Field
                                  as="textarea"
                                  className="textarea"
                                    name="comments"
                                    placeholder="Enter Comments"
                                    value={values.comments}
                                    onChange={handleChange}
                                  ></Field>
                                </Col>
                               
                              </Row>
                              </>:""} */}
                              <Row lg={12} className="section-header">
                          <Col lg={8}>
                            <h5 style={{ marginTop: "5px" }}>Area Details</h5>
                          </Col>
                        </Row>
                        <Row></Row>

                        <FieldArray name="areadetails">
                          {({ push, remove }) => (
                            <div>
                              {values.areadetails?.map((record, index) => (
                                <Row key={index}>
                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Area Type <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      as="select"
                                      name={`areadetails[${index}].area`}
                                      placeholder="Enter Area Type"
                                      value={values.areadetails[index].area}
                                    >
                                      <option value=""> --select--</option>
                                      <option value="Carpet">Carpet</option>
                                      <option value="BUA">BUA</option>
                                      <option value="SBUA">SBUA</option>
                                    </Field>

                                    {errors?.areadetails?.length > 0
                                      ? (errors.areadetails?.at(index)?.floor ||
                                          errors.areadetails?.at(index)?.unit ||
                                          errors.areadetails?.at(index)
                                            ?.value) &&
                                        !errors.areadetails?.at(index)
                                          ?.area && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>
                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Floor No. <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      as="select"
                                      name={`areadetails[${index}].floor`}
                                      placeholder="Enter Flooor"
                                      value={values.areadetails[index].floor}
                                    >
                                      <option value=""> --select--</option>
                              {floornumber && floornumber.map((e)=>(
                              <option value={e.value}>{e.label}</option>
                              ))}
                                    </Field>
                                    {errors?.areadetails?.length > 0
                                      ? (errors.areadetails?.at(index)?.value ||
                                          errors.areadetails?.at(index)?.unit ||
                                          errors.areadetails?.at(index)
                                            ?.area) &&
                                        !errors.areadetails?.at(index)
                                          ?.floor && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>

                                  <Col lg={2}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Unit <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      as="select"
                                      name={`areadetails[${index}].unit`}
                                    >
                                      <option value="">--Select--</option>
                                      <option value="Sq.m">Sq.m</option>
                                      <option value="Sq.ft">Sq.ft</option>
                                      <option value="Acre">Acre</option>
                                      <option value="Gaj">Gaj</option>
                                      <option value="Sq.yards">Sq.yards</option>
                                    </Field>
                                    {errors?.areadetails?.length > 0
                                      ? (errors.areadetails?.at(index)?.floor ||
                                          errors.areadetails?.at(index)
                                            ?.value ||
                                          errors.areadetails?.at(index)
                                            ?.area) &&
                                        !errors.areadetails?.at(index)
                                          ?.unit && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Value <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      type="text"
                                      name={`areadetails[${index}].value`}
                                      placeholder="Enter value"
                                      value={values.areadetails[index].value}
                                    />
                                    {errors?.areadetails?.length > 0
                                      ? (errors.areadetails?.at(index)?.floor ||
                                          errors.areadetails?.at(index)?.unit ||
                                          errors.areadetails?.at(index)
                                            ?.area) &&
                                        !errors.areadetails?.at(index)
                                          ?.value && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>
                                  <Col lg={1} className="mt-2">
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Action
                                    </label>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          values.areadetails[index].id !==
                                          undefined
                                        ) {
                                          const id =
                                            values.areadetails[index].id;
                                          setRemoveIndex((ids) => [...ids, id]);
                                        }
                                        remove(index);
                                        if (
                                          values.areadetails.length === 1 &&
                                          index === 0
                                        ) {
                                          push({
                                            area: "",
                                            floor: "",
                                            unit: "",
                                            value: "",
                                            type: "height",
                                          });
                                        }
                                      }}
                                    >
                                      {" "}
                                      X{" "}
                                    </Button>{" "}
                                    &nbsp;
                                    {index !== values.areadetails.length - 1 ? (
                                      ""
                                    ) : (
                                      <Button
                                        // disabled={index !== values.records.length - 1}

                                        // style={{marginLeft:"1150px", marginTop:"-150px",height:"40px",width:"40px"}}
                                        type="button"
                                        onClick={() =>
                                          push({
                                            area: "",
                                            floor: "",
                                            unit: "",
                                            value: "",
                                            type: "area",
                                          })
                                        }
                                      >
                                        {" "}
                                        +{" "}
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                              ))}
                            </div>
                          )}
                        </FieldArray>
                        </Row>
                        <Row lg={12} className="section-header">
                          <Col lg={8}>
                            <h5 style={{ marginTop: "5px" }}>Height Details</h5>
                          </Col>
                        </Row>

                        <FieldArray name="heightdetails">
                          {({ push, remove }) => (
                            <div>
                              {values.heightdetails?.map((record, index) => (
                                <Row key={index}>
                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Floor No. <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      as="select"
                                      name={`heightdetails[${index}].floor`}
                                      placeholder="Enter Flooor"
                                      value={values.heightdetails[index].floor}
                                    >
                                     <option value=""> --select--</option>
                              {floornumber && floornumber.map((e)=>(
                              <option value={e.value}>{e.label}</option>
                              ))}
                                    </Field>
                                    {errors?.heightdetails?.length > 0
                                      ? (errors.heightdetails?.at(index)
                                          ?.unit ||
                                          errors.heightdetails?.at(index)
                                            ?.value) &&
                                        !errors.heightdetails?.at(index)
                                          ?.floor && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Unit <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      as="select"
                                      name={`heightdetails[${index}].unit`}
                                      value={values.heightdetails[index].unit}
                                    >
                                      <option value="">--Select--</option>
                                      <option value="ft">ft</option>
                                      <option value="inch">inch</option>
                                      <option value="m">m</option>
                                      <option value="Cm">Cm</option>
                                    </Field>
                                    {errors?.heightdetails?.length > 0
                                      ? (errors.heightdetails?.at(index)
                                          ?.floor ||
                                          errors.heightdetails?.at(index)
                                            ?.value) &&
                                        !errors.heightdetails?.at(index)
                                          ?.unit && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Height Value <b class="red-star"></b>
                                    </label>
                                    <Field
                                      className="Field"
                                      required
                                      type="text"
                                      name={`heightdetails[${index}].value`}
                                      placeholder="Enter value"
                                      value={values.heightdetails[index].value}
                                    />
                                    {errors?.heightdetails?.length > 0
                                      ? (errors.heightdetails?.at(index)
                                          ?.floor ||
                                          errors.heightdetails?.at(index)
                                            ?.unit) &&
                                        !errors.heightdetails?.at(index)
                                          ?.value && (
                                          <div className="error-message">
                                            Please enter all values
                                          </div>
                                        )
                                      : ""}
                                  </Col>

                                  <Col lg={3} className='mt-2'>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Action
                                    </label>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          values.heightdetails[index].id !==
                                          undefined
                                        ) {
                                          const id =
                                            values.heightdetails[index].id;
                                          setRemoveIndex((ids) => [...ids, id]);
                                        }
                                        remove(index);
                                        if (
                                          values.heightdetails.length === 1 &&
                                          index === 0
                                        ) {
                                          push({
                                            floor: "",
                                            unit: "",
                                            value: "",
                                            type: "height",
                                          });
                                        }
                                      }}
                                    >
                                      {" "}
                                      X{" "}
                                    </Button>{" "}
                                    &nbsp;
                                    {index !==
                                    values.heightdetails.length - 1 ? (
                                      ""
                                    ) : (
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          push({
                                            floor: "",
                                            unit: "",
                                            value: "",
                                            type: "height",
                                          })
                                        }
                                      >
                                        {" "}
                                        +{" "}
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                              ))}
                            </div>
                          )}
                        </FieldArray>

                        
                      </Form>
                    )}

                    {currentSection === 3 && (
                      <Form disabled="disabled" onSubmit={handleSubmit}>
                        <Row className="view-form-header align-items-center">
                          <Col lg={8}>
                            {lead.id ? (
                              <>
                                <b>Edit Lead</b>
                                <h4>{lead.firstname + " " + lead.lastname}</h4>
                              </>
                            ) : (
                              "New Lead"
                            )}
                          </Col>
                          <Col
                            lg={4}
                            className="d-flex flex-col justify-content-end align-items-end"
                          >
                            <Button
                              className="btn-sm mx-2"
                              onClick={handleBack}
                            >
                              Back
                            </Button>{" "}
                            &nbsp;
                            <Button
                              className="btn-sm mx-2"
                              variant="success"
                              onClick={handleSubmit}
                            >
                              Save
                            </Button>
                            &nbsp;
                            <Button
                              className="btn-sm mx-2"
                              variant="danger"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <Stepper activeStep={currentSection - 1}>
                              {steps.map((step, index) => (
                                <Step key={index}>
                                  <StepLabel
                                    onClick={() => setCurrentSection(index + 1)}
                                  >
                                    {step.title}
                                  </StepLabel>
                                </Step>
                              ))}
                            </Stepper>
                          </Col>
                        </Row>

                        <Row lg={12} className="section-header">
                          <Col lg={7}>
                            <h5 style={{ marginTop: "5px" }}>
                              Client Information
                            </h5>
                          </Col>
                        </Row>
                        <fieldset
                          className="Field"
                          disabled="disabled"
                          title="You cannot make changes here. Please go back and make the necessary modifications."
                        >
                          <Row>
                            <Row>
                              {values.salutation && values.salutation !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    Salutation<b class="red-star"></b>
                                  </label>
                                  <Field
                                    className="custom-input"
                                    as="select"
                                    name="salutation"
                                    value={values.salutation}
                                    onChange={handleChange}
                                  >
                                    <option value="">--Select--</option>
                                    <option value="Mr">Mr.</option>
                                    <option value="Mrs">Mrs.</option>
                                    <option value="Ms">Ms.</option>
                                    <option value="Dr">Dr.</option>
                                    <option value="Prof">Prof.</option>
                                  </Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.firstname && values.firstname !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    First Name <b class="red-star">*</b>
                                  </label>
                                  <Field
                                    className="custom-input"
                                    type="text"
                                    name="firstname"
                                    placeholder="Enter firstname"
                                    style={{
                                      textTransform: "capitalize",
                                    }}
                                    value={values.firstname}
                                    onChange={handleChange}
                                    required
                                  />
                                  <ErrorMessage
                                    name="firstname"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.lastname && values.lastname !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    Last Name<b class="red-star">*</b>
                                  </label>
                                  <Field
                                    className="custom-input"
                                    type="text"
                                    name="lastname"
                                    style={{
                                      textTransform: "capitalize",
                                    }}
                                    value={values.lastname}
                                    onChange={handleChange}
                                    placeholder="Enter lastname"
                                    required
                                  />
                                  <ErrorMessage
                                    name="lastname"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.designation &&
                              values.designation !== "" ? (
                                <Col lg={3}>
                                  <label>Designation</label>
                                  <Field
                                    className="custom-input"
                                    type="text"
                                    name="designation"
                                    style={{
                                      textTransform: "capitalize",
                                    }}
                                    value={values.designation}
                                    onChange={handleChange}
                                    placeholder="Enter designation"
                                    required
                                  />
                                  <ErrorMessage
                                    name="designation"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.phone && values.phone !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    Phone
                                    <b class="red-star"></b>
                                  </label>
                                  <Field
                                    className="custom-input"
                                    type="number"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    required
                                  />
                                  <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.email && values.email !== "" ? (
                                <Col lg={3}>
                                  <label>Email </label>
                                  <Field
                                    //  style={{ textTransform: "lowercase" }}
                                    className="custom-input"
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={values.email}
                                    onChange={handleChange}
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.leadsource && values.leadsource !== "" ? (
                                <Col lg={3}>
                                  <label>Lead Source</label>
                                  <Field
                                    type="text"
                                    name="leadsource"
                                    placeholder="Enter Lead Source"
                                    value={values.leadsource}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.leadstage && values.leadstage !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    Stage<b class="red-star"></b>
                                  </label>
                                  <Field
                                    as="select"
                                    name="leadstage"
                                    onChange={handleChange}
                                    value={values.leadstage}
                                    required
                                  >
                                    <option value="Open">Open</option>
                                    <option value="Close">Close</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Negotiation Stage">
                                      Negotiation Stage
                                    </option>
                                    <option value="Due Diligence Stage">
                                      Due Diligence Stage{" "}
                                    </option>
                                    <option value="Upload File Stage">
                                      Upload File Stage
                                    </option>
                                    <option value="Tenure">Tenure</option>
                                    <option value="Neighboring Brands">
                                      Neighboring Brands
                                    </option>
                                    <option value="Stamp Duty">
                                      Stamp Duty
                                    </option>
                                    <option value="Registration Cost">
                                      Registration Cost
                                    </option>
                                    <option value="Maintenance Charges">
                                      Maintenance Charges
                                    </option>
                                    <option value="Possession Timeline">
                                      Possession Timeline
                                    </option>
                                  </Field>
                                  <ErrorMessage
                                    name="leadstage"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.alternatephone &&
                              values.alternatephone !== "" ? (
                                <Col lg={3}>
                                  <label>Alternate Phone</label>
                                  <Field
                                    className="custom-input"
                                    type="number"
                                    name="alternatephone"
                                    placeholder="Enter alternatephone number"
                                    value={values.alternatephone}
                                    onChange={handleChange}
                                    required
                                  />
                                  <ErrorMessage
                                    name="alternatephone"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.clienttype && values.clienttype !== "" ? (
                                <Col lg={3}>
                                  <label> Type </label>
                                  <Field
                                    as="select"
                                    value={values.clienttype}
                                    name="clienttype"
                                    onChange={handleChange}
                                  >
                                    <option value="">Select Type</option>
                                    <option value="Owner">Owner</option>
                                    <option value="Company">Company</option>
                                    <option value="Individual">
                                      Individual
                                    </option>
                                  </Field>
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.company && values.company !== "" ? (
                                <Col lg={3}>
                                  <label>Company</label>
                                  <Field
                                    type="text"
                                    name="company"
                                    placeholder="Enter company"
                                    value={values.company}
                                    onChange={handleChange}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.office && values.office !== "" ? (
                                <Col lg={3}>
                                  <label>Office Address </label>
                                  <Field
                                    type="text"
                                    name="office"
                                    placeholder="Enter Office Address"
                                    value={values.office}
                                    onChange={handleChange}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.ownerid && values.ownerid !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    Assign Staff
                                    <b class="red-star"> *</b>
                                  </label>
                                  <Field
                                    as="select"
                                    name="ownerid"
                                    value={values.ownerid}
                                    defaultValue={defaultOwner}
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">
                                      --Select Assign Staff--
                                    </option>
                                    {ownerList &&
                                      ownerList.map((ele) => (
                                        <option value={ele.id}>
                                          {ele.username}
                                        </option>
                                      ))}
                                  </Field>

                                  <ErrorMessage
                                    name="ownerid"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                            </Row>

                            <Row lg={12} className="section-header mx-auto ">
                              <Col lg={7}>
                                <h5 style={{ marginTop: "5px" }}>
                                  Address Information
                                </h5>
                              </Col>
                            </Row>

                            <Row>
                              {values.clientstate &&
                              values.clientstate !== "" ? (
                                <Col lg={3}>
                                  <label>State</label>
                                  <Field
                                    as="select"
                                    name="clientstate"
                                    value={values.clientstate}
                         
                                  >
                                    <option value="">--Select </option>
                                    {stateList &&
                                      stateList.map((state) => (
                                        <option value={state}>{state}</option>
                                      ))}
                                  </Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.clientcity && values.clientcity !== "" ? (
                                <Col lg={3}>
                                  <label>City</label>
                                  <Field
                                    className=""
                                    as="select"
                                    name="clientcity"
                                    value={values.clientcity}
                                    onChange={handleChange}
                                  >
                                    <option value="">--Select City--</option>
                                    {cityList &&
                                      cityList.map((ele) => (
                                        <option value={ele.name}>
                                          {ele.name}
                                        </option>
                                      ))}
                                  </Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.clientstreet &&
                              values.clientstreet !== "" ? (
                                <Col lg={3}>
                                  <label>Street</label>
                                  <Field
                                    className=""
                                    type="text"
                                    name="clientstreet"
                                    placeholder="Enter street"
                                    value={values.clientstreet}
                                    onChange={handleChange}
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.clientpincode &&
                              values.clientpincode !== "" ? (
                                <Col lg={3}>
                                  <label> Pincode </label>
                                  <Field
                                    className=" no-arrows"
                                    type="number"
                                    name="clientpincode"
                                    placeholder="Enter pincode"
                                    value={values.clientpincode}
                                    onChange={handleChange}
                                  />
                                  <ErrorMessage
                                    name="clientpincode"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.clientcountry &&
                              values.clientcountry !== "" ? (
                                <Col lg={3}>
                                  <label>Country </label>
                                  <Field
                                    className=""
                                    type="text"
                                    name="clientcountry"
                                    defaultValue={"India"}
                                    value={values.clientcountry}
                                    onChange={handleChange}
                                  />
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.zone && values.zone !== "" ? (
                                <Col lg={3}>
                                  <label> Zone </label>
                                  <Field
                                    as="select"
                                    value={values.zone}
                                    name="zone"
                                    onChange={handleChange}
                                  >
                                    <option value="">--Select Zone--</option>
                                    <option value="North">North</option>
                                    <option value="East">East</option>
                                    <option value="South">South</option>
                                    <option value="West">West</option>
                                  </Field>
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.clientcalloption &&
                              values.clientcalloption !== "" ? (
                                <Col lg={3}>
                                  <label>
                                    Third Party Call
                                    <b class="red-star"></b>
                                  </label>
                                  <Field
                                    type="checkbox"
                                    name="clientcalloption"
                                    defaultChecked={false}
                                    checked={values.clientcalloption}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "clientcalloption",
                                        e.target.checked
                                      );
                                      handleChange(e);
                                    }}
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                            </Row>
                            {values.clientcalloption &&
                            values.clientcalloption === true ? (
                              <>
                                {values.clientcalloptionname !== "" ||
                                values.clientcalloptiondate !== "" ||
                                values.clientcalloptionmobile ||
                                values.clientcalloptionemail !== "" ||
                                values.clientcalloptionremark !== "" ||
                                values.clientcalloptionratepersqfeet ||
                                values.thirdparty !== "" ||
                                values.clientcalloptionbrokerage !== "" ? (
                                  <Row lg={12} className="section-header">
                                    <Col lg={7}>
                                      <h5 style={{ marginTop: "5px" }}>
                                        Third Party Information
                                      </h5>
                                    </Col>
                                  </Row>
                                ) : (
                                  ""
                                )}
                                <Row>
                                  {values.clientcalloptionname &&
                                  values.clientcalloptionname !== "" ? (
                                    <Col lg={3}>
                                      <label> Name </label>
                                      <Field
                                        type="text"
                                        name="clientcalloptionname"
                                        placeholder="Enter Client Call Name"
                                        value={values.clientcalloptionname}
                                        onChange={handleChange}
                                      />
                                      <ErrorMessage
                                        name="clientcalloptionname"
                                        component="div"
                                        className="error-message"
                                      />
                                    </Col>
                                  ) : (
                                    ""
                                  )}

                                  {values.clientcalloptionmobile &&
                                  values.clientcalloptionmobile !== "" ? (
                                    <Col lg={3}>
                                      <label>
                                        Mobile
                                        <b class="red-star"></b>
                                      </label>
                                      <Field
                                        className="custom-input"
                                        type="number"
                                        name="clientcalloptionmobile"
                                        placeholder="Enter mobile number"
                                        value={values.clientcalloptionmobile}
                                        onChange={handleChange}
                                        required
                                      />
                                      <ErrorMessage
                                        name="clientcalloptionmobile"
                                        component="div"
                                        className="error-message"
                                      />
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                  {values.clientcalloptionemail &&
                                  values.clientcalloptionemail !== "" ? (
                                    <Col lg={3}>
                                      <label>Client Call Email </label>
                                      <Field
                                        style={{
                                          textTransform: "lowercase",
                                        }}
                                        className="custom-input"
                                        type="email"
                                        name="clientcalloptionemail"
                                        placeholder="Enter Client Call Email"
                                        value={values.clientcalloptionemail}
                                        onChange={handleChange}
                                      />
                                      <ErrorMessage
                                        name="clientcalloptionemail"
                                        component="div"
                                        className="error-message"
                                      />
                                    </Col>
                                  ) : (
                                    ""
                                  )}

                                  {values.clientcalloptiondate &&
                                  values.clientcalloptiondate !== "" ? (
                                    <Col lg={3}>
                                      <label>Date</label>
                                      <Field
                                        className="custom-input"
                                        type="date"
                                        name="clientcalloptiondate"
                                        placeholder="Enter date"
                                        value={values.clientcalloptiondate}
                                        onChange={handleChange}
                                        required
                                      />
                                      <ErrorMessage
                                        name="clientcalloptiondate"
                                        component="div"
                                        className="error-message"
                                      />
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                  {values.clientcalloptionremark &&
                                  values.clientcalloptionremark !== "" ? (
                                    <Col lg={3}>
                                      <label>Remarks</label>
                                      <Field
                                        type="text"
                                        name="clientcalloptionremark"
                                        placeholder="Enter Remarks"
                                        value={values.clientcalloptionremark}
                                      ></Field>
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                  {values.clientcalloptionratepersqfeet &&
                                  values.clientcalloptionratepersqfeet !==
                                    "" ? (
                                    <Col lg={3}>
                                      <label> Rate/Sq.Ft.</label>
                                      <Field
                                        type="number"
                                        name="clientcalloptionratepersqfeet"
                                        placeholder="Enter Rate/Sq.Ft"
                                        value={
                                          values.clientcalloptionratepersqfeet
                                        }
                                      />
                                      <ErrorMessage
                                        name="clientcalloptionratepersqfeet"
                                        component="div"
                                        className="error-message"
                                      />
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                  {values.clientcalloptionbrokerage &&
                                  values.clientcalloptionbrokerage !== "" ? (
                                    <Col lg={3}>
                                      <label>Brokerage</label>
                                      <Field
                                        type="text"
                                        name="clientcalloptionbrokerage"
                                        placeholder="Enter Brokerage"
                                        value={values.clientcalloptionbrokerage}
                                      ></Field>
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                  {/* {values.thirdparty && values.thirdparty !== ''?  <Col lg={3}>
                                          <label>Third Party</label>
                                          <Field
                                            as="select"
                                            name="thirdparty"
                                            placeholder="Enter Third party"
                                            value={values.thirdparty}
                                          >
                                            <option value=''>--Third Party--</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                          </Field>
                                        </Col>:''} */}
                                </Row>
                              </>
                            ) : (
                              ""
                            )}
                            {
                              <Row lg={12} className="section-header mx-auto">
                                <Col lg={8}>
                                  <h5 style={{ marginTop: "5px" }}>
                                    Lead Information
                                  </h5>
                                </Col>
                              </Row>
                            }
                            <Row>
                              {values.transactiontype &&
                              values.transactiontype !== "" ? (
                                <Col lg={3}>
                                  <label>Transaction Type</label>
                                  <Field
                                    className="Field"
                                    as="select"
                                    name="transactiontype "
                                    value={values.transactiontype}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "transactiontype",
                                        e.target.value
                                      );
                                      setFieldValue("typeofclient", "");
                                      setFieldValue("vertical", "");
                                      setFieldValue("verticaltype", "");
                                      setFieldValue("subverticaltype", "");
                                      const temp = [];
                                      if (e.target.value !== "") {
                                        if (
                                          Object.entries(
                                            data.Dependency[e.target.value]
                                          ).length > 0
                                        ) {
                                          for (const [
                                            key,
                                            value,
                                          ] of Object.entries(
                                            data.Dependency[e.target.value]
                                          )) {
                                            temp.push(key);
                                          }
                                          setTypeOfClient(temp);
                                        } else {
                                          setTypeOfClient(
                                            data.Value["Type of client"]
                                          );
                                        }
                                      } else {
                                        setTypeOfClient([]);
                                      }
                                    }}
                                  >
                                    <option value="">--Select--</option>
                                    {transcationType &&
                                      transcationType.map((value) => (
                                        <option value={value}>{value}</option>
                                      ))}
                                  </Field>
                                  <ErrorMessage
                                    name="transactiontype"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.typeofclient &&
                              values.typeofclient !== "" ? (
                                <Col lg={3}>
                                  <label>Type Of Client</label>
                                  <Field
                                    className="Field"
                                    disabled={!values.transactiontype}
                                    as="select"
                                    name="typeofclient"
                                    value={values.typeofclient}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "typeofclient",
                                        e.target.value
                                      );
                                      setFieldValue("vertical", "");
                                      setFieldValue("verticaltype", "");
                                      setFieldValue("subverticaltype", "");
                                      const temp = [];
                                      if (e.target.value !== "") {
                                        if (
                                          Object.entries(
                                            data.Dependency[
                                              values.transactiontype
                                            ]
                                          ).length > 0
                                        ) {
                                          for (const [
                                            key,
                                            value,
                                          ] of Object.entries(
                                            data.Dependency[
                                              values.transactiontype
                                            ][e.target.value]
                                          )) {
                                            temp.push(key);
                                          }
                                          setVertical(temp);
                                        } else {
                                          setVertical(data.Value["Vertical"]);
                                        }
                                      } else {
                                        setVertical([]);
                                      }
                                    }}
                                  >
                                    <option value="">--Select--</option>
                                    {typeOfClient.length > 0 &&
                                      typeOfClient.map((value) => (
                                        <option value={value}>{value}</option>
                                      ))}
                                  </Field>
                                  <ErrorMessage
                                    name="typeofclient"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.vertical && values.vertical !== "" ? (
                                <Col lg={3}>
                                  <label>Vertical In Property</label>
                                  <Field
                                    className="Field"
                                    disabled={!values.typeofclient}
                                    as="select"
                                    name="vertical"
                                    value={values.vertical}
                                    onChange={(e) => {
                                      setFieldValue("vertical", e.target.value);
                                      setFieldValue("verticaltype", "");
                                      setFieldValue("subverticaltype", "");

                                      if (e.target.value !== "") {
                                        if (
                                          Object.entries(
                                            data.Dependency[
                                              values.transactiontype
                                            ]
                                          ).length > 0
                                        ) {
                                          const temp = [];
                                          for (const [
                                            key,
                                            value,
                                          ] of Object.entries(
                                            data.Dependency[
                                              values.transactiontype
                                            ][values.typeofclient][
                                              e.target.value
                                            ]
                                          )) {
                                            temp.push(key);
                                          }
                                          setVerticalType(temp);
                                        } else {
                                          setVerticalType(
                                            data.Value["Vertical-type"]
                                          );
                                        }
                                      } else {
                                        setVerticalType([]);
                                      }
                                    }}
                                  >
                                    <option value="">--Select--</option>
                                    {verticals &&
                                      verticals.map((value) => (
                                        <option value={value}>{value}</option>
                                      ))}
                                  </Field>
                                  <ErrorMessage
                                    name="vertical"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.verticaltype &&
                              values.verticaltype !== "" ? (
                                <Col lg={3}>
                                  <label>Vertical Type</label>
                                  <Field
                                    disabled={!values.vertical}
                                    className="Field"
                                    as="select"
                                    name="verticaltype"
                                    value={values.verticaltype}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "verticaltype",
                                        e.target.value
                                      );
                                      setFieldValue("subverticaltype", "");

                                      if (e.target.value !== "") {
                                        if (
                                          Object.entries(
                                            data.Dependency[
                                              values.transactiontype
                                            ]
                                          ).length > 0
                                        ) {
                                          const temp = [];
                                          for (const [
                                            key,
                                            value,
                                          ] of Object.entries(
                                            data.Dependency[
                                              values.transactiontype
                                            ][values.typeofclient][
                                              values.vertical
                                            ][e.target.value]
                                          )) {
                                            temp.push(...value);
                                          }
                                          setSubVerticalType(temp);
                                        } else {
                                          setSubVerticalType(
                                            data.Value["Sub vertical type"]
                                          );
                                        }
                                      } else {
                                        setSubVerticalType([]);
                                      }
                                    }}
                                  >
                                    <option value="">--Select--</option>
                                    {verticalType &&
                                      verticalType.map((value) => (
                                        <option value={value}>{value}</option>
                                      ))}
                                  </Field>
                                  <ErrorMessage
                                    name="verticaltype"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.subverticaltype &&
                              values.subverticaltype !== "" ? (
                                <Col lg={3}>
                                  <label>Sub Vertical Type</label>
                                  <Field
                                    disabled={!values.verticaltype}
                                    className="Field"
                                    as="select"
                                    name="subverticaltype"
                                    value={values.subverticaltype}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "subverticaltype",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">--Select--</option>
                                    {subVerticalType &&
                                      subVerticalType.map((value) => (
                                        <>
                                          <option value={value}>{value}</option>
                                          <option value="BTS">BTS</option>
                                          <option value="Under Construction">
                                            Under Construction
                                          </option>
                                        </>
                                      ))}
                                  </Field>
                                  <ErrorMessage
                                    name="subverticaltype"
                                    component="div"
                                    className="error-message"
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                              {/* {values.areafrom !=='' || values.areato !== '' || values.areavaluein? <Col lg={3}>
                                 <label>Area / From / To</label>
                                 <div className="d-flex w-80">
                                   <Field
                                     as="select"
                                     name="areavaluein"
                                     placeholder="Enter Area"
                                     value={values.areavaluein}
                                     onChange={handleChange}
                                   >
                                     <option value="">--Select--</option>
                                     <option value="Gaj">Gaj</option>
                                     <option value="Sq.feet">Sq.feet</option>
                                     <option value="Yards">Yards</option>
                                     <option value="Sq. yards">
                                       Sq. yards
                                     </option>
                                     <option value="Sq. Meter">
                                       Sq. Meter
                                     </option>
                                   </Field>
                                   <Field
                                     type="number"
                                     name="areafrom"
                                     placeholder="Enter from"
                                     value={values.areafrom}
                                     onChange={handleChange}
                                   />
                                 
                                   <Field
                                     type="number"
                                     name="areato"
                                     placeholder="Enter to"
                                     value={values.areato}
                                     onChange={handleChange}
                                   />
                                 
                                 </div>
                                 <ErrorMessage
                                 name="areato"
                                 component="div"
                                 className="error-message"
                               />
                                  <ErrorMessage
                                 name="areafrom"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''} */}
                              {values.numberofcarortruckparking &&
                              values.numberofcarortruckparking !== "" ? (
                                <Col lg={3}>
                                  <label># of Car/ Truck Parking</label>
                                  <Field
                                    type="number"
                                    name="numberofcarortruckparking"
                                    placeholder="Enter # of Car/ Truck Parking"
                                    value={values.numberofcarortruckparking}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.type && values.type !== "" ? (
                                <Col lg={3}>
                                  <label>Type</label>
                                  <Field
                                    as="select"
                                    name="type"
                                    value={values.type}
                                    onChange={handleChange}
                                  >
                                    <option value="">---Select type---</option>
                                    <option value="ready">Ready</option>
                                    <option value="under construction">
                                      Under Construction
                                    </option>
                                  </Field>
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.otherdetails &&
                              values.otherdetails !== "" ? (
                                <Col lg={3}>
                                  <label>Other Details</label>
                                  <Field
                                    className="Field"
                                    type="text"
                                    placeholder="Enter other details"
                                    name="otherdetails"
                                    value={values.otherdetails}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.otherlocations &&
                              values.otherlocations !== "" ? (
                                <Col lg={3}>
                                  <label>Other Locations</label>
                                  <Field
                                    className="Field"
                                    type="text"
                                    placeholder="Enter other locations"
                                    name="otherlocations"
                                    value={values.otherlocations}
                                  />
                                </Col>
                              ) : (
                                ""
                              )}

                              {/* {values.budgetrangein !=='' || values.budgetrangefrom !== '' || values.budgetrangeto?<Col lg={3}>
                                 <label>Budget Range from and To</label>
                                 <div className="d-flex w-80">
                                   <Field
                                     as="select"
                                     name="budgetrangein"
                                     value={values.budgetrangein}
                                     min={100000}
                                   >
                                     <option value=''>Budget Range from and To</option>
                                     <option value="crores">Crores</option>
                                     <option value="lacs">Lacs</option>
                                   </Field>

                                   <Field
                                     as="select"
                                     name="budgetrangefrom"
                                     placeholder="Select Budget Range from "
                                     value={values.budgetrangefrom}
                                   >
                                     <option>--Select Budget Range--</option>
                                     <option value="1">1</option>
                                     <option value="10">10</option>
                                     <option value="20">20</option>
                                     <option value="30">30</option>
                                     <option value="40">40</option>
                                     <option value="50">50</option>
                                     <option value="60">60</option>
                                     <option value="70">70</option>
                                     <option value="80">80</option>
                                     <option value="90">90</option>
                                   </Field>
                                   <Field
                                     as="select"
                                     name="budgetrangeto"
                                     placeholder="Select Budget Range To"
                                     value={values.budgetrangeto}
                                   >
                                     <option>--Select Budget Range--</option>
                                     <option value="10">10</option>
                                     <option value="20">20</option>
                                     <option value="30">30</option>
                                     <option value="40">40</option>
                                     <option value="50">50</option>
                                     <option value="60">60</option>
                                     <option value="70">70</option>
                                     <option value="80">80</option>
                                     <option value="90">90</option>
                                     <option value="100 ">100</option>
                                   </Field>
                                 </div>
                               </Col>:''} */}

                              {/* {values.carpetarea && values.carpetarea !== ''?<Col lg={3}>
                                <label>Carpet Area</label>
                                <Field
                                  type="number"
                                  name="carpetarea"
                                  placeholder="Enter Carpet Area"
                                  value={values.carpetarea}
                                />
                                <ErrorMessage
                                name="carpetarea"
                                component="div"
                                className="error-message"
                              />
                              </Col>:''} */}
                              {/* {values.heightrangein !=='' || values.heightfrom !== '' || values.heightto?<Col lg={3}>
                                 <label>Height From and To</label>
                                 <div className="d-flex w-80">
                                   <Field
                                     as="select"
                                     name="heightrangein"
                                     placeholder="Enter Height Range"
                                     value={values.heightrangein}
                                   >
                                     <option value="">select Range</option>
                                     <option value="cm">CM</option>
                                     <option value="mtr">Mtrs</option>
                                   </Field>
                                   <Field
                                     type="number"
                                     name="heightfrom"
                                     placeholder="Enter Height from "
                                     value={values.heightfrom}
                                   />
                                     
                                   <Field
                                     type="number"
                                     name="heightto"
                                     placeholder="Enter Height  to"
                                     value={values.heightto}
                                   />
                                     
                                 </div>
                                 <ErrorMessage 
                                 name="heightfrom"
                                 component="div"
                                 className="error-message"
                               />
                               <ErrorMessage
                                 name="heightto"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''} */}
                              {/* {  values.floorfrom !=='' || values.floorto !== ''?<Col lg={3}>
                                 <label>Floor From and To</label>
                                 <div className="d-flex w-80">
                                   <Field
                                     type="number"
                                     name="floorfrom"
                                     placeholder="Enter Floor from "
                                     value={values.floorfrom}
                                   />
                                   <Field
                                     type="number"
                                     name="floorto"
                                     placeholder="Enter Floor  To"
                                     value={values.floorto}
                                   />
                                 </div>
                                 <ErrorMessage
                                 name="floorfrom"
                                 component="div"
                                 className="error-message"
                               />
                               <ErrorMessage
                                 name="floorto"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''} */}
                              {values.completiondate &&
                              values.completiondate !== "" ? (
                                <Col lg={3}>
                                  <label>Completion Date</label>
                                  <Field
                                    type="date"
                                    name="completiondate"
                                    placeholder="Enter Completion Date"
                                    value={values.completiondate}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.frontagein !== "" ||
                              values.frontage !== "" ? (
                                <Col lg={3}>
                                  <label>Frontage</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      as="select"
                                      name="frontage"
                                      //placeholder="Enter Frontage"
                                      value={values.frontage}
                                    >
                                      <option value="">Select</option>
                                      <option value="ft.">Feet</option>
                                      <option value="mtr.">Meter</option>
                                    </Field>
                                    <Field
                                      type="number"
                                      name="frontagein"
                                      placeholder="Enter Frontage"
                                      value={values.frontagein}
                                    />
                                  </div>
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.verticaltype === "Warehousing" && (
                                <Row lg={12} className="section-header mx-auto">
                                  <Col lg={6}>
                                    <h5 style={{ marginTop: "5px" }}>
                                      Warehousing Details
                                    </h5>
                                  </Col>
                                </Row>
                              )}

                              {values.noofdocksvalue &&
                              values.noofdocksvalue !== "" ? (
                                <Col lg={3}>
                                  <label>No. of docks</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      type="number"
                                      name="noofdocksvalue"
                                      placeholder="Enter value"
                                      value={values.noofdocksvalue}
                                    />
                                    <ErrorMessage
                                      name="noofdocksvalue"
                                      component="div"
                                      className="error-message"
                                    />
                                  </div>
                                </Col>
                              ) : (
                                ""
                              )}
                              {values.noofwashroomsvalue &&
                              values.noofwashroomsvalue !== "" ? (
                                <Col lg={3}>
                                  <label>No. of Washrooms</label>
                                  <div className="d-flex w-80">
                                    <Field
                                      type="number"
                                      name="noofwashroomsvalue"
                                      placeholder="Enter value"
                                      value={values.noofwashroomsvalue}
                                    />
                                  </div>
                                </Col>
                              ) : (
                                ""
                              )}

                              {values.openareaunit !== "" ||
                              values.openareavalue !== ""
                                ? values.verticaltype === "Warehousing" && (
                                    <Col lg={3}>
                                      <label>Open Area</label>
                                      <div className="d-flex w-80">
                                        <Field
                                          as="select"
                                          name="openareaunit"
                                          placeholder="Enter Area"
                                          value={values.openareaunit}
                                          onChange={handleChange}
                                        >
                                          <option value="">--Select--</option>
                                          <option value="Gaj">Gaj</option>
                                          <option value="Sq.feet">
                                            Sq.feet
                                          </option>
                                          <option value="Yards">Yards</option>
                                          <option value="Sq. yards">
                                            Sq. yards
                                          </option>
                                          <option value="Sq. Meter">
                                            Sq. Meter
                                          </option>
                                        </Field>
                                        <Field
                                          type="text"
                                          name="openareavalue"
                                          placeholder="Enter value"
                                          value={values.openareavalue}
                                        />
                                      </div>
                                      {(touched.openareaunit ||
                                        touched.openareavalue) && (
                                        <div className="error-message">
                                          {errors.openareaunit ||
                                            errors.openareavalue}
                                        </div>
                                      )}
                                    </Col>
                                  )
                                : ""}

                              {values.closeareaunit !== "" ||
                              values.closeareavalue !== ""
                                ? values.verticaltype === "Warehousing" && (
                                    <Col lg={3}>
                                      <label>Close Area</label>
                                      <div className="d-flex w-80">
                                        <Field
                                          as="select"
                                          name="closeareaunit"
                                          placeholder="Enter unit"
                                          value={values.closeareaunit}
                                          onChange={handleChange}
                                        >
                                          <option value="">--Select--</option>
                                          <option value="Gaj">Gaj</option>
                                          <option value="Sq.feet">
                                            Sq.feet
                                          </option>
                                          <option value="Yards">Yards</option>
                                          <option value="Sq. yards">
                                            Sq. yards
                                          </option>
                                          <option value="Sq. Meter">
                                            Sq. Meter
                                          </option>
                                        </Field>
                                        <Field
                                          type="text"
                                          name="closeareavalue"
                                          placeholder="Enter value"
                                          value={values.closeareavalue}
                                        />
                                      </div>
                                      {(touched.closeareaunit ||
                                        touched.closeareavalue) && (
                                        <div className="error-message">
                                          {errors.closeareaunit ||
                                            errors.closeareavalue}
                                        </div>
                                      )}
                                    </Col>
                                  )
                                : ""}

                              {values.rentalunit !== "" ||
                              values.rentalvalue !== ""
                                ? values.verticaltype === "Warehousing" && (
                                    <Col lg={3}>
                                      <label>Rental</label>
                                      <div className="d-flex w-80">
                                        <Field
                                          as="select"
                                          name="rentalunit"
                                          placeholder="Enter unit"
                                          value={values.rentalunit}
                                          onChange={handleChange}
                                        >
                                          <option value="">--Select--</option>
                                          <option value="Gaj">Gaj</option>
                                          <option value="Sq.feet">
                                            Sq.feet
                                          </option>
                                          <option value="Yards">Yards</option>
                                          <option value="Sq. yards">
                                            Sq. yards
                                          </option>
                                          <option value="Sq. Meter">
                                            Sq. Meter
                                          </option>
                                        </Field>
                                        <Field
                                          type="text"
                                          name="rentalvalue"
                                          placeholder="Enter value"
                                          value={values.rentalvalue}
                                        />
                                      </div>
                                      {(touched.rentalunit ||
                                        touched.rentalvalue) && (
                                        <div className="error-message">
                                          {errors.rentalunit ||
                                            errors.rentalvalue}
                                        </div>
                                      )}
                                    </Col>
                                  )
                                : ""}

                              {values.areaorlocationbrief &&
                              values.areaorlocationbrief !== "" ? (
                                <Col lg={3}>
                                  <label>Area/Location breif</label>
                                  <Field
                                    as="textarea"
                                    className="textarea"
                                    name="areaorlocationbrief"
                                    placeholder="Enter Area/Location"
                                    value={values.areaorlocationbrief}
                                  ></Field>
                                </Col>
                              ) : (
                                ""
                              )}

                              {/* {values.acmanagerdetails && values.acmanagerdetails !== ''? <Col lg={3}>
                               <label>
                               Ac Manager Details<b class="red-star"></b>
                               </label>
                               <Field
                                 type="checkbox"
                                 name="acmanagerdetails"
                                 defaultChecked={false}
                                 checked={values.acmanagerdetails}
                                 onChange={(e) => {
                                   setFieldValue(
                                     "acmanagerdetails",
                                     e.target.checked
                                   );
                                   handleChange(e);
                                 }}
                               />
                             </Col>:''} */}
                              {/* {values.acmanagerdetails && values.acmanagerdetails === true ?<>
                               <Row>
                              {values.client && values.client !== ''? <Col lg={3}>
                                 <label>Client</label>
                                 <Field
                                   type="text"
                                   name="client"
                                   placeholder="Enter client"
                                   value={values.client}
                                 ></Field>
                                  <ErrorMessage
                                 name="client"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''}

                              { values.ilid && values.ilid !== ''?<Col lg={3}>
                                 <label>Il Id</label>
                                 <Field
                                   type="text"
                                   name="ilid"
                                   placeholder="Enter ilid"
                                   value={values.ilid}
                                 ></Field>
                               </Col>:''}
                               {values.ilcreateddate && values.ilcreateddate !== ''?<Col lg={3}>
                                 <label>Il Created Date</label>
                                 <Field
                                   type="date"
                                   name="ilcreateddate"
                                   placeholder="Enter il created date "
                                   value={values.ilcreateddate}
                                 ></Field>
                               </Col>:''}
                              {values.ilcloseddate && values.ilcloseddate !== ''? <Col lg={3}>
                                 <label>Il Closed Date</label>
                                 <Field
                                   type="date"
                                   name="ilcloseddate"
                                   placeholder="Enter Il closed date"
                                   value={values.ilcloseddate}
                                 ></Field>
                               </Col>:''}
                              {values.actions && values.actions !== ''? <Col lg={3}>
                                 <label>Actions</label>
                                 <Field
                                   type="text"
                                   name="actions"
                                   placeholder="Enter actions"
                                   value={values.actions}
                                 ></Field>
                               </Col>:''}
                              {values.acmanagername && values.acmanagername !== ''? <Col lg={3}>
                                 <label> A/c Manager Name</label>
                                 <Field
                                   type="text"
                                   name="acmanagername"
                                   placeholder="Enter  A/c Manager Name"
                                   value={values.acmanagername}
                                 ></Field>
                                  <ErrorMessage
                                 name="acmanagername"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''}
                               {values.memberoffice && values.memberoffice !== ''?<Col lg={3}>
                                 <label>Member Office</label>
                                 <Field
                                   type="text"
                                   name="memberoffice"
                                   placeholder="Enter Member Office"
                                   value={values.memberoffice}
                                 ></Field>
                               </Col>:''}
                              { values.acmanageremail && values.acmanageremail !== ''?<Col lg={3}>
                                 <label> A/c Manager Email Id</label>
                                 <Field
                                   type="text"
                                   name="acmanageremail"
                                   placeholder="Enter A/c Manager Email Id"
                                   value={values.acmanageremail}
                                 ></Field>
                                  <ErrorMessage
                                 name="acmanageremail"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''}
                               {values.acmanagerphone && values.acmanagerphone !== ''?<Col lg={3}>
                                 <label> A/c Manager Phone</label>
                                 <Field
                                   type="number"
                                   name="acmanagerphone"
                                   placeholder="Enter A/c Manager Phone"
                                   value={values.acmanagerphone}
                                 ></Field>
                                  <ErrorMessage
                                 name="acmanagerphone"
                                 component="div"
                                 className="error-message"
                               />
                               </Col>:''}
                              
                               {/* {values.comments && values.comments !== ''?<Col lg={3}>
                                 <label>Comments</label>
                                 <Field
                                 as="textarea"
                                 className="textarea"
                                   name="comments"
                                   placeholder="Enter Comments"
                                   value={values.comments}
                                   onChange={handleChange}
                                 ></Field>
                               </Col>:''} */}

                              {/* </Row>
                             </>:""}  */}
                            </Row>

                            {values.heightdetails &&
                              values.heightdetails !== "" && (
                                <Row lg={12} className="section-header mx-auto">
                                  <Col lg={8}>
                                    <h5 style={{ marginTop: "5px" }}>
                                      Height Details
                                    </h5>
                                  </Col>
                                </Row>
                              )}
                              {values.areadetails &&
                              values.areadetails !== "" && (
                                <Row lg={12} className="section-header mx-auto">
                                  <Col lg={8}>
                                    <h5 style={{ marginTop: "5px" }}>
                                      Area Details
                                    </h5>
                                  </Col>
                                </Row>
                              )}
                            {values.areadetails && values.areadetails !== "" ? (
                              <>
                                <Row>
                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Area Type <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Floor No. <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={2}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Unit <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Value <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={1}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Action
                                    </label>
                                  </Col>
                                </Row>
                                <FieldArray name="areadetails">
                                  {({ push, remove }) => (
                                    <div>
                                      {values.areadetails?.map(
                                        (record, index) => (
                                          <Row
                                            key={index}
                                            style={{
                                              paddingBottom: "2rem",
                                            }}
                                          >
                                            <Col lg={3}>
                                              <Field
                                                className="Field"
                                                required
                                                as="select"
                                                name={`areadetails[${index}].area`}
                                                placeholder="Enter Area Type"
                                                value={
                                                  values.areadetails[index].area
                                                }
                                              >
                                                <option value="">
                                                  {" "}
                                                  --select--
                                                </option>
                                                <option value="Carpet">
                                                  Carpet
                                                </option>
                                                <option value="BUA">BUA</option>
                                                <option value="SBUA">
                                                  SBUA
                                                </option>
                                              </Field>

                                              <ErrorMessage
                                                name={`areadetails[${index}].area`}
                                                component="div"
                                                className="error-message"
                                              />
                                            </Col>
                                            <Col lg={3}>
                                              <Field
                                                className="Field"
                                                required
                                                type = 'text'
                                                name={`areadetails[${index}].floor`}
                                                placeholder="Enter Flooor"
                                                value={
                                                  values.areadetails[index]
                                                    .floor
                                                }
                                              >
                                              </Field>
                                             
                                            </Col>

                                            <Col lg={2}>
                                              <Field
                                                className="Field"
                                                required
                                                as="select"
                                                name={`areadetails[${index}].unit`}
                                              >
                                                <option value="">
                                                  --Select--
                                                </option>
                                                <option value="Sq.m">
                                                  Sq.m
                                                </option>
                                                <option value="Sq.ft">
                                                  Sq.ft
                                                </option>
                                                <option value="Acre">
                                                  Acre
                                                </option>
                                                <option value="Gaj">Gaj</option>
                                                <option value="Sq.yards">
                                                  Sq.yards
                                                </option>
                                              </Field>
                                              <ErrorMessage
                                                name={`areadetails[${index}].unit`}
                                                component="div"
                                                className="error-message"
                                              />
                                            </Col>

                                            <Col lg={3}>
                                              <Field
                                                className="Field"
                                                required
                                                type="text"
                                                name={`areadetails[${index}].value`}
                                                placeholder="Enter value"
                                                value={
                                                  values.areadetails[index]
                                                    .value
                                                }
                                              />
                                              <ErrorMessage
                                                name={`areadetails[${index}].value`}
                                                component="div"
                                                className="error-message"
                                              />
                                            </Col>

                                            <Col lg={1}>
                                              <Button
                                                disabled={
                                                  values.areadetails.length ===
                                                  1
                                                }
                                                type="button"
                                                onClick={() => remove(index)}
                                              >
                                                {" "}
                                                X{" "}
                                              </Button>{" "}
                                              &nbsp;
                                              {index !==
                                              values.areadetails.length - 1 ? (
                                                ""
                                              ) : (
                                                <Button
                                                  // disabled={index !== values.records.length - 1}

                                                  // style={{marginLeft:"1150px", marginTop:"-150px",height:"40px",width:"40px"}}
                                                  type="button"
                                                  onClick={() =>
                                                    push({
                                                      area: "",
                                                      floor: "",
                                                      unit: "",
                                                      value: "",
                                                      type: "area",
                                                    })
                                                  }
                                                >
                                                  {" "}
                                                  +{" "}
                                                </Button>
                                              )}
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                    </div>
                                  )}
                                </FieldArray>
                              </>
                            ) : (
                              ""
                            )}
                            {values.heightdetails &&
                            values.heightdetails !== "" ? (
                              <>
                                <Row>
                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Floor No. <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Unit <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Height Value <b class="red-star">*</b>
                                    </label>
                                  </Col>

                                  <Col lg={3}>
                                    <label
                                      className="form-view-label"
                                      htmlFor="formBasicName"
                                    >
                                      Action
                                    </label>
                                  </Col>
                                </Row>
                                <FieldArray name="heightdetails">
                                  {({ push, remove }) => (
                                    <div>
                                      {values.heightdetails?.map(
                                        (record, index) => (
                                          <Row
                                            key={index}
                                            style={{
                                              paddingBottom: "2rem",
                                            }}
                                          >
                                            <Col lg={3}>
                                              <Field
                                                className="Field"
                                                required
                                                type = 'text'
                                                name={`heightdetails[${index}].floor`}
                                                placeholder="Enter Flooor"
                                                value={
                                                  values.heightdetails[index]
                                                    .floor
                                                }
                                              >
                                                
                                              </Field>
                                             
                                            </Col>

                                            <Col lg={3}>
                                              <Field
                                                className="Field"
                                                required
                                                as="select"
                                                name={`heightdetails[${index}].unit`}
                                                value={
                                                  values.heightdetails[index]
                                                    .unit
                                                }
                                              >
                                                <option value="">
                                                  --Select--
                                                </option>
                                                <option value="ft">ft</option>
                                                <option value="inch">
                                                  inch
                                                </option>
                                                <option value="m">m</option>
                                                <option value="Cm">Cm</option>
                                              </Field>
                                              <ErrorMessage
                                                name={`heightdetails[${index}].unit`}
                                                component="div"
                                                className="error-message"
                                              />
                                            </Col>

                                            <Col lg={3}>
                                              <Field
                                                className="Field"
                                                required
                                                type="text"
                                                name={`heightdetails[${index}].value`}
                                                placeholder="Enter value"
                                                value={
                                                  values.heightdetails[index]
                                                    .value
                                                }
                                              />
                                              <ErrorMessage
                                                name={`heightdetails[${index}].value`}
                                                component="div"
                                                className="error-message"
                                              />
                                            </Col>

                                            <Col lg={3}>
                                              <Button
                                                disabled={
                                                  values.heightdetails
                                                    .length === 1
                                                }
                                                type="button"
                                                onClick={() => remove(index)}
                                              >
                                                {" "}
                                                X{" "}
                                              </Button>{" "}
                                              &nbsp;
                                              {index !==
                                              values.heightdetails.length -
                                                1 ? (
                                                ""
                                              ) : (
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    push({
                                                      floor: "",
                                                      unit: "",
                                                      value: "",
                                                      type: "height",
                                                    })
                                                  }
                                                >
                                                  {" "}
                                                  +{" "}
                                                </Button>
                                              )}
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                    </div>
                                  )}
                                </FieldArray>
                              </>
                            ) : (
                              ""
                            )}

                            
                          </Row>
                        </fieldset>
                      </Form>
                    )}
                  </>
                )}
              </Formik>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LeadEdit;
