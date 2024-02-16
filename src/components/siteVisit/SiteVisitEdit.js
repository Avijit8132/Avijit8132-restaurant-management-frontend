import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import jwt_decode from "jwt-decode";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import { Field, Formik, ErrorMessage, FieldArray } from "formik";
import { schemaSiteVisitEdit } from "../common/ValidateSchemaHelper";
import { siteVisitInitialValues } from "../common/InitialValuesHelper";
import { floornumber } from "../NewJson";


const SiteVisitEdit = (props) => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({});
    const [validated, setValidated] = useState(false);
    const [site, setSite] = useState(null);
    const [removeIndex, setRemoveIndex] = useState([]);

    const [projects, setProjects] = useState([]);
    const [ownerList, setownerList] = useState([]);
    const [siteVisit, setSiteVisit] = useState(
        location.state ? location.state : {}
    );

    useEffect(() => {
        async function init() {
            if (localStorage.getItem("token") && !location?.state) {
                let user = jwt_decode(localStorage.getItem("token"));
                setUserInfo(user);
                var obj = {};
                obj.value = user.id;
                obj.label = user.username;
                // setSelectedOwner(obj);
                setSiteVisit({ ...siteVisit, ownerid: user.id });
            }

            //fetch properties
            const propertiesResult = await inventoryApi.fetchProperties();
            if (propertiesResult) {
              setProjects(propertiesResult);
            } else {
              setProjects([]);
            }

            let owner;
            owner = await inventoryApi.fetchUsers();
            //.log("accountList--> ", owner);
            if (owner && owner.length) {
                //.log("ownerList--> ", owner);
                setownerList(owner)
            } else {
                setownerList([])
            }
        }
        init();
    }, []);

    const handleSubmitSave = async (values) => {
      values.heightdetails = values.heightdetails.filter((item) =>(item.floor !== "" || item.unit !== "" || item.value !== ""));
      values.areadetails = values.areadetails.filter((item) =>item.floor !== "" || item.unit !== "" || item.value !== "" || item.area !== "");
      
        let result = {};
        if (siteVisit.id) {
            values.id = siteVisit.id;
            if(removeIndex.length > 0){
              let deletAarea = await inventoryApi.deletePropertyAreadetails(removeIndex)
              console.log('deletAarea',deletAarea);
            }
            result = await inventoryApi.saveSiteVisitHistory(values);
            //.log('result siteVisit', result);
            if (result) {
                //.log("if result true");
                PubSub.publish("RECORD_SAVED_TOAST", {
                    title: "Record Saved",
                    message: "Record saved successfully",
                });
                navigate(`/sitevisit/${result.id}`, { state: result });
            }
        } else {
            //.log("====create====", values);
            result = await inventoryApi.createSiteVisitHistory(values);
            //.log('result site visit', result);
            if (result) {
                PubSub.publish("RECORD_SAVED_TOAST", {
                    title: "Record Saved",
                    message: "Record saved successfully",
                });
                navigate(`/sitevisit/${result.id}`, { state: result });
            }
        }
    };

    const handleCancel = () => {
        if (siteVisit.id)
            navigate("/sitevisit/" + siteVisit.id, { state: siteVisit });
        else navigate("/sitevisit");
    };

    return (
      <Container className="view-form inputbox">
        {location?.state?.id ? (
          <CustomSeparator
            cmpListName="Site Visits"
            cmpViewName={siteVisit.sitename}
            currentCmpName="Edit"
            indexLength="2"
            indexViewLength="3"
            cmpViewUrl={"/sitevisit/" + siteVisit.id}
            url="/sitevisit"
          ></CustomSeparator>
        ) : (
          <CustomSeparator
            cmpListName="Site Visits"
            currentCmpName="Create"
            indexLength="2"
            url="/sitevisit"
          ></CustomSeparator>
        )}

        <Row className="mt-4 mx-2">
          <Col lg={12} className="ibs-form-section">
            <Formik
              validationSchema={schemaSiteVisitEdit()}
              onSubmit={handleSubmitSave}
              initialValues={siteVisitInitialValues(siteVisit)}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                errors,
                setFieldValue,
              }) => (
                <Form
                  className="mt-3"
                  onSubmit={handleSubmit}
                  noValidate
                  validated={validated}
                >
                  <Row
                    style={{ marginTop: "-12px" }}
                    className="view-form-header align-items-center"
                  >
                    <Col lg={3}>
                      {siteVisit.id ? (
                        <>
                          Edit Site Visit
                          {siteVisit.sitename && <h4>{siteVisit.sitename}</h4>}
                        </>
                      ) : (
                        "New Site Visit"
                      )}
                    </Col>
                    <Col lg={9} className="d-flex justify-content-end">
                      <Button className="btn-sm mx-2" onClick={handleSubmit}>
                        Save
                      </Button>
                      <Button
                        className="btn-sm"
                        variant="danger"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                  <Row lg={12} className="ibs-form-section">
                    <Col lg={6}>
                    <label >Site<b class="red-star"> *</b> </label>
                        <Field
                          required
                          type="text"
                          placeholder="Enter Site"
                          value={values.sitename}
                          name="sitename"
                          onChange={handleChange}
                        />
                      <ErrorMessage
                        name="sitename"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>
                    <Col lg={6}>
                    <label >Field Person<b class="red-star"> *</b> </label>
                        <Field
                          required
                          as="select"
                          id="formBasicFieldPerson"
                          value={values.fieldpersonid}
                          name="fieldpersonid"
                          onChange={handleChange}
                        >
                          <option value="">--Select Field Person--</option>
                          {ownerList.map((user) => (
                            <option key={user.value} value={user.id}>
                              {`${user.firstname} ${user.lastname}`}
                            </option>
                          ))}
                        </Field>
                     
                      <ErrorMessage
                        name="fieldpersonid"
                        component="div"
                        className="error-message mx-3 mx-3"
                      />
                    </Col>
                    <Col lg={6}>
                    <label >Owner Name</label>
                        <Field
                          type="text"
                          name="ownername"
                          placeholder="Enter Owner name"
                          onChange={handleChange}
                          value={values.ownername}
                        />
                      <ErrorMessage
                        name="ownername"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>
                    <Col lg={6}>
                    <label >Status</label>
                        <Field
                          as="select"
                          disabled={true}
                          value={values.status}
                          name="status"
                          onChange={handleChange}
                        >
                          <option value="Not Visited">Not Visited</option>
                          <option value="Checked In">Checked In</option>
                          <option value="Checked Out">Checked Out</option>
                          <option value="Visited">Visited</option>
                        </Field>
                    
                    </Col>

                    {/* --------------New Fields - saideep--------------- */}

                    <Col lg={6}>
                    <label >Owner Act Number</label>
                        <Field
                          type="text"
                          name="owneractnumber"
                          placeholder="Enter owner act number"
                          onChange={handleChange}
                          value={values.owneractnumber}
                        />
                      <ErrorMessage
                        name="owneractnumber"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label >Second Contact Person Name & Ref</label>
                        <Field
                          type="text"
                          name="secondcontactpersonname"
                          placeholder="Enter second contact person name"
                          onChange={handleChange}
                          value={values.secondcontactpersonname}
                        />
                      <ErrorMessage
                        name="secondcontactpersonname"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label >Second Contact Number</label>
                        <Field
                          type="text"
                          name="secondcontactpersonphone"
                          placeholder="Enter second contact Number"
                          onChange={handleChange}
                          value={values.secondcontactpersonphone}
                        />
                      <ErrorMessage
                        name="secondcontactpersonphone"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label >Email ID</label>
                        <Field
                          type="text"
                          name="email"
                          placeholder="Enter Email ID"
                          onChange={handleChange}
                          value={values.email}
                        />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label >Property Type</label>
                        <Field
                          type="text"
                          name="propertytype"
                          placeholder="Enter  Property type"
                          onChange={handleChange}
                          value={values.propertytype}
                        />
                      <ErrorMessage
                        name="propertytype"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>Property Approval Status</label>
                        <Field
                          type="text"
                          name="propertyapprovalstatus"
                          placeholder="Enter Property Approval status"
                          onChange={handleChange}
                          value={values.propertyapprovalstatus}
                        />
                      <ErrorMessage
                        name="propertyapprovalstatus"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>No. of Floors(Incl.Ground)</label>
                        <Form.Control
                          type="text"
                          name="nooffloor"
                          placeholder="Enter No. of Floors"
                          onChange={handleChange}
                          value={values.nooffloor}
                        />
                      <ErrorMessage
                        name="nooffloor"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label> Floor Map Available</label>
                        <Field
                        as="select"
                          value={values.floormapavailable}
                          name="floormapavailable"
                          onChange={handleChange}
                        >
                          <option value="">--Select--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      <ErrorMessage
                        name="floormapavailable"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    {/* <Col lg={6}>
                    <label>Property Area</label>
                        <Field
                          as="textarea"
                          className="textarea"
                          type="text"
                          name="propertyarea"
                          placeholder="Enter Property Area"
                          onChange={handleChange}
                          value={values.propertyarea}
                        />
                      <ErrorMessage
                        name="propertyarea"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col> */}

                    <Col lg={6}>
                    <label>Fire NOC Available</label>
                        <Field
                           as="select"
                          value={values.firenocavailble}
                          name="firenocavailble"
                          onChange={handleChange}
                        >
                          <option value="">--Select--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      <ErrorMessage
                        name="firenocavailble"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>


                    {/* <Col lg={6}>
                    <label>Each Floor Height</label>
                        <Field
                          type="text"
                          name="eachfloorheight"
                          placeholder="Enter Each Floor Height"
                          onChange={handleChange}
                          value={values.eachfloorheight}
                        />
                      <ErrorMessage
                        name="eachfloorheight"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col> */}
                    <Col lg={6}>
                    <label>Frontage</label>
                        <Field
                          type="text"
                          name="frontage"
                          placeholder="Enter frontage"
                          onChange={handleChange}
                          value={values.frontage}
                        />
                      <ErrorMessage
                        name="frontage"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>No. of Entries</label>
                        <Field
                          type="text"
                          name="noofentries"
                          placeholder="Enter No. of Entries"
                          onChange={handleChange}
                          value={values.noofentries}
                        />
                      <ErrorMessage
                        name="noofentries"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>
                    <Col lg={6}>
                    <label>Lift Available</label>
                        <Field
                        as="select"
                          value={values.liftavailable}
                          name="liftavailable"
                          onChange={handleChange}
                        >
                          <option value="">--Select--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      <ErrorMessage
                        name="liftavailable"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>Location</label>
                        <Field
                          type="text"
                          name="location"
                          placeholder="Enter Location"
                          onChange={handleChange}
                          value={values.location}
                        />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>Parking Space</label>
                        <Field
                          as="select"
                          value={values.parkingspace}
                          name="parkingspace"
                          onChange={handleChange}
                        >
                          <option value="">--Select--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      <ErrorMessage
                        name="parkingspace"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>Location(Area)</label>
                        <Field
                          type="text"
                          name="locationarea"
                          placeholder="Enter location area"
                          onChange={handleChange}
                          value={values.locationarea}
                        />
                      <ErrorMessage
                        name="locationarea"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label> Previous Brand</label>
                        <Field
                        as="select"
                          value={values.previousbrand}
                          name="previousbrand"
                          onChange={handleChange}
                        >
                          <option value="">--Select--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      <ErrorMessage
                        name="previousbrand"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>Expected Rent</label>
                        <Field
                          type="text"
                          name="expectedrent"
                          placeholder="Enter Expected Rent"
                          onChange={handleChange}
                          value={values.expectedrent}
                        />
                      <ErrorMessage
                        name="expectedrent"
                        component="div"
                        className="error-message mx-3"
                      />
                    </Col>

                    <Col lg={6}>
                    <label>Description</label>
                        <Field
                          as="textarea"
                         className="textarea"
                          name="description"
                          placeholder="Enter Description"
                          onChange={handleChange}
                          value={values.description}
                        />
                    </Col>

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
                </Form>
              )}
            </Formik>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
};

export default SiteVisitEdit;
