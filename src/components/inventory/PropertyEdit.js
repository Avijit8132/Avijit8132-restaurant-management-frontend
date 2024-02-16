import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import InputGroup from "react-bootstrap/InputGroup";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import CityState from "../../constants/CityState.json";
import jwt_decode from "jwt-decode";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import data from "../NewJson";
import { schemaPropertyEdit } from "../common/ValidateSchemaHelper";
import { propertyEditInitialValues } from "../common/InitialValuesHelper";
import ContactNewModal from "../contact/ContactNewModal";
import moment from "moment";
import { floornumber } from "../NewJson";

const PropertyEdit = (props) => {
  const location = useLocation();
  const [property, setProperty] = useState(
    location.state ? location.state : {}
  );
  console.log('property',property);
  const [userInfo, setUserInfo] = useState({});
  const [validated, setValidated] = useState(false);
  const [typeOfClient, setTypeOfClient] = useState([property.typeofclient]);
  const [transcationType, setTranscationType] = useState([
    property.transactiontype,
  ]);
  const [verticals, setVertical] = useState([property.vertical]);
  const [verticalType, setVerticalType] = useState([property.verticaltype]);
  const [subVerticalType, setSubVerticalType] = useState([
    property.subverticaltype,
  ]);
  const [active, setActive] = useState(
    location?.state?.showonweb ? true : false
  );
  const [modalShow, setModalShow] = useState(false);

  const navigate = useNavigate();
  const [selectedOwner, setSelectedOwner] = useState();
  const [cityList, setCityList] = useState(false);
  const [ofcCityList, setOfcCityList] = useState(false);
  const [ofcstateList, setofcstateList] = useState(false);
  const [stateList, setStateList] = useState(false);
  const [removeIndex, setRemoveIndex] = useState([]);


  useEffect(() => {
    setTranscationType(data.Value["Transaction type"]);
  });

  useEffect(() => {
    var temp = [];
    CityState.map((ele) => {
      if (!temp.includes(ele.state)) {
        temp.push(ele.state);
      }
    });
    setStateList(temp.sort());
    var tempList = CityState.filter((ele) => ele.state === property.state);
    setCityList(tempList.sort());
  }, []);

  useEffect(() => {
    var temp = [];
    CityState.map((ele) => {
      if (!temp.includes(ele.state)) {
        temp.push(ele.state);
      }
    });
    setofcstateList(temp.sort());
    var tempList = CityState.filter((ele) => ele.state === property.officestate);
    setOfcCityList(tempList.sort());
  }, []);

  const [contactList, setContactList] = useState([]);
  const [ownerList, setownerList] = useState([]);
  const [defaultOwner, setDefaultOwner] = useState([]);
  const [defaultContact, setDefaultContact] = useState([]);

  useEffect(() => {
    async function init() {
      // Fetch Contacts
      const conResult = await inventoryApi.fetchContacts();
      if (conResult && conResult.length > 0) {
        setContactList(conResult);
      } else {
        setContactList([]);
      }
      if (property.id && property.contactid) {
        setDefaultContact([
          {
            id: "",
            contactname: conResult.find((e) => e.id === property.contactid)
              ?.contactname,
          },
        ]);
      } 
      // else if (defaultContact.id !== '' ) {
      //   console.log('conResult.find((e) => e.id === property.contactid)',conResult.find((e) => e.id === defaultContact.contactid));
      //   setDefaultContact([
      //     {
      //       id: "",
      //       contactname: conResult.find((e) => e.id === property.contactid)
      //         ?.contactname,
      //     },
      //   ]);
      // }
       else {
        setDefaultContact([{ id: "", contactname: "" }]);
      }
    }
    init();
  }, [modalShow]);

  useEffect(() => {
    async function init() {
      if (localStorage.getItem("token") && !location?.state) {
        let user = jwt_decode(localStorage.getItem("token"));
        setUserInfo(user);
        var obj = {};
        obj.value = user.id;
        obj.label = user.username;
        setSelectedOwner(obj);
        setProperty({ ...property, ownerid: user.id });
      }

      // Fetch Owners from user
      const result = await inventoryApi.fetchUsers();
      if (result) {
        setownerList(result);
        if (property.id) {
          setDefaultOwner([
            { id: property.ownerid, username: property.ownername },
          ]);
        } else {
          setDefaultOwner([{ id: "", username: "" }]);
        }
      }

      let owner;
      owner = await inventoryApi.fetchUsers();
      if (owner && owner?.length) {
        setownerList(owner);
      } else {
        setownerList([]);
      }
    }
    init();
  }, []);

  // useEffect(() => {
  //   async function init() {
  //     // Fetch Contacts
  //     const conResult = await inventoryApi.fetchContacts();
  //     if (conResult && conResult.length > 0) {
  //       setContactList(conResult);
  //     } else {
  //       setContactList([]);
  //     }
  //   }
  //   init();
  // }, [modalShow]);

  const handleSubmitSave = async (values) => {

    values.heightdetails = values.heightdetails.filter((item) =>(item.floor !== "" || item.unit !== "" || item.value !== ""));
    values.areadetails = values.areadetails.filter((item) =>item.floor !== "" || item.unit !== "" || item.value !== "" || item.area !== "");
    

    console.log("values",values);

    for (const key in values) {
      if (values[key] === undefined || values[key] === null) {
        values[key] = "";
      }
    }

    property.showonweb = active;
    let result = {};
    if (property.id) {
      values.id = property.id;
      if(removeIndex.length > 0){
        let deletAarea = await inventoryApi.deletePropertyAreadetails(removeIndex)
        console.log('deletAarea',deletAarea);
      }
      result = await inventoryApi.saveProperty(values);
      //.log("result1", result);
      if (result) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/properties/${result.id}`, { state: result });
      }
    }
     else {
      result = await inventoryApi.createProperty(values);
      console.log("result", result);
      if (result) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/properties/${result.id}`, { state: result });
      }
    }
  };
  const handleCancel = () => {
    if (property.id)
      navigate("/properties/" + property.id, { state: property });
    else navigate("/properties");
  };

  return (
    <Container className="view-form inputbox">
      {location?.state?.id ? (
        <CustomSeparator
          cmpListName="Inventory "
          cmpViewName={property.name}
          currentCmpName="Edit"
          indexLength="2"
          indexViewLength="3"
          cmpViewUrl={"/properties/" + property.id}
          url="/properties"
        ></CustomSeparator>
      ) : (
        <CustomSeparator
          cmpListName="Inventory"
          currentCmpName="Create"
          indexLength="2"
          url="/properties"
        ></CustomSeparator>
      )}

      <Row className="mt-4 mx-2 justify-content-between" >
        <Col lg={12} className="ibs-form-section" >
          <Formik
            validationSchema={schemaPropertyEdit(property)}
            onSubmit={handleSubmitSave}
            initialValues={propertyEditInitialValues(property)}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              setFieldValue,
              touched,
              errors,
            }) => (
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row className="view-form-header align-items-center">
                  <Col lg={3}>
                    {property.id ? (
                      <>
                        Edit Inventory
                        <h4>{property.name}</h4>
                      </>
                    ) : (
                      "New Inventory"
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
                <Row>
                  <Col lg={3}>
                    <label>
                      Property Name<b class="red-star">*</b>
                    </label>
                    <Field
                      style={{ textTransform: "capitalize" }}
                      required
                      type="text"
                      name="name"
                      placeholder="Enter Property Name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message"
                    />
                  </Col>

                  <Col lg={3} style={{marginLeft:'-18px'}}>
                    <Form.Group className="mx-3" controlId="contact">
                      <Form.Label className="form-view-label" htmlFor="contact">
                        Contact <b class="red-star"></b>
                      </Form.Label>
                     { console.log('defaultContact',defaultContact)}
                      {defaultContact.length > 0 ? (
                        <InputGroup>
                          <Typeahead
                            required
                            id="basic-typeahead-single2"
                            defaultSelected={defaultContact}
                            name="contactid"
                            labelKey="contactname"
                            options={contactList}
                            onChange={(event) => {
                              if (event.length > 0) {
                                setFieldValue("contactid", event[0].id);
                              } else {
                                setFieldValue("contactid", "");
                              }
                            }}
                            placeholder="Choose a contact..."
                          />
                          <Button style={{marginLeft:'-60px'}}
                                variant="primary"
                                onClick={() => {setModalShow(true)}}
                              > 
                                <b>+</b>
                              </Button>
                          <ErrorMessage
                            name="contactid"
                            component="div"
                            className="error-message"
                          />
                        </InputGroup>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>

                  {/* <Col lg={3}>
                    <label>Super-Built Up Area</label>
                    <Field
                      required
                      type="text"
                      name="superbuiltuparea"
                      placeholder="Enter Particulars"
                      value={values.superbuiltuparea}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={3}>
                    <label>Floor</label>
                    <Field
                      type="text"
                      name="floor"
                      placeholder="Enter floor  "
                      value={values.floor}
                      onChange={handleChange}
                    />
                  </Col>

                 <Col lg={6}>
                    <label>Area / From / To</label>
                    <div className="d-flex w-80">
                      <Field
                        as="select"
                        name="arearangein"
                        placeholder="Enter Area"
                        value={values.arearangein}
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
                        type="number"
                        name="area"
                        placeholder="Enter from"
                        value={values.area}
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
                    {((touched.arearangein && errors.arearangein) ||
                      (errors.area && touched.area) ||
                      (errors.areato && touched.areato)) && (
                      <div className="error-message">
                        {errors.arearangein || errors.area || errors.areato}
                      </div>
                    )}
                  </Col> */}
                </Row>

                <Row>
                  <Col lg={3}>
                    <label>
                      Transaction Type<b class="red-star">*</b>
                    </label>
                    <Field
                      className="Field"
                      as="select"
                      name="transactiontype "
                      value={values.transactiontype}
                      onChange={(e) => {
                        setFieldValue("transactiontype", e.target.value);
                        setFieldValue("vertical", "");
                        setFieldValue("verticaltype", "");
                        setFieldValue("subverticaltype", "");
                        const temp = [];
                        if (e.target.value !== "") {
                          if (
                            Object.entries(data.Dependency[e.target.value])
                              .length > 0
                          ) {
                            for (const [key, value] of Object.entries(
                              data.Dependency[e.target.value]
                            )) {
                              temp.push(key);
                            }
                            setTypeOfClient(temp);
                            const tmp = [];
                            setFieldValue("typeofclient", temp[0]);

                            if (
                              Object.entries(data.Dependency[e.target.value])
                                .length > 0
                            ) {
                              for (const [key, value] of Object.entries(
                                data.Dependency[e.target.value][temp[0]]
                              )) {
                                tmp.push(key);
                              }
                              setVertical(tmp);
                            }
                          } else {
                            setTypeOfClient(data.Value["Type of client"]);
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
                    <label>
                      Type Of Client<b class="red-star">*</b>
                    </label>
                    <Field
                      className="Field"
                      // disabled={!values.transactiontype}
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
                    <label>
                      Vertical In Property<b class="red-star">*</b>
                    </label>
                    <Field
                      className="Field"
                      // disabled={!values.typeofclient}
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
                            setVerticalType(data.Value["Vertical-type"]);
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
                    <label>
                      Vertical Type<b class="red-star">*</b>
                    </label>
                    <Field
                      // disabled={!values.vertical}
                      className="Field"
                      as="select"
                      name="verticaltype"
                      value={values.verticaltype}
                      onChange={(e) => {
                        setFieldValue("verticaltype", e.target.value);
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
                            setFieldValue("subverticaltype", temp[0]);
                          } else {
                            setSubVerticalType(data.Value["Sub vertical type"]);
                          }
                        } else {
                          setSubVerticalType([]);
                        }
                      }}
                    >
                      <option value="">--Select--</option>
                      {verticalType &&
                        verticalType.map((value) => (
                          <>
                          <option value={value}>{value}</option>
                          </>
                        ))}
                        
                    </Field>
                    <ErrorMessage
                      name="verticaltype"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={3}>
                    <label>
                      Sub Vertical Type<b class="red-star">*</b>
                    </label>
                    <Field
                      // disabled={!values.verticaltype}
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
                    <label> Possession Date</label>
                    <Field
                      type="date"
                      name=" Possessiondate"
                      value={values.Possessiondate}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={3}>
                    <label>Possession Status</label>
                    <Field
                      as="select"
                      name="possessionstatus"
                      value={values.possessionstatus}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                      
                    </Field>
                  </Col>
                  <Col lg={3}>
                    <label>Property Type</label>
                    <Field
                      as="select"
                      name="propertytype"
                      value={values.propertytype}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="Sale">Sale</option>
                      <option value="Lease">Lease</option>
                      <option value="Rent">Rent</option>
                      <option value="Investiment">Investiment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Additional Rooms">Additional Rooms</option>
                      <option value="Facing">Facing</option>
                    </Field>
                  </Col>

                  <Col lg={3}>
                    <label>Furnished Status</label>
                    <Field
                      as="select"
                      name="furnishedstatus"
                      value={values.furnishedstatus}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="Semi Furnished">Semi Furnished</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </Field>
                  </Col>

                  <Col lg={3}>
                    <label>
                      Lease Expiration Date{" "}
                      <b class="red-star">
                        {values.transactiontype === "Lease" ? " *" : ""}
                      </b>
                    </label>
                    <Field
                      min={moment(new Date()).format("DD/MM/YYYY")}
                      type="date"
                      name="leaseexpirationdate"
                      value={values.leaseexpirationdate}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="leaseexpirationdate"
                      component="div"
                      className="error-message"
                    />
                  </Col>

                  <Col lg={3}>
                    <label>Description</label>
                    <Field
                      as="textarea"
                      className="textarea"
                      name="description"
                      placeholder="Enter Description"
                      value={values.description}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {values.verticaltype === "Warehousing" && (
                  <Row lg={12} className="section-header mx-auto">
                    <Col lg={2}>
                      <h5 style={{ marginTop: "5px" }}>Warehousing Details</h5>
                    </Col>
                  </Row>
                )}
                <Row>

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
                        type="text"
                        name="openareavalue"
                        placeholder="Enter value"
                        value={values.openareavalue}
                      />
                    </div>
                    {(touched.openareaunit || touched.openareavalue) && (
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
                        type="text"
                        name="closeareavalue"
                        placeholder="Enter value"
                        value={values.closeareavalue}
                      />
                    </div>
                    {(touched.closeareaunit || touched.closeareavalue) && (
                      <div className="error-message">
                        {errors.closeareaunit || errors.closeareavalue}
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
                </Row>
                <Row lg={12} className="section-header mx-auto">
                  <Col lg={8}>
                    <h5 style={{ marginTop: "5px" }}>Area Details</h5>
                  </Col>
                </Row>
                <FieldArray name="areadetails">
                  {({ push, remove }) => (
                    <div>
                      {values.areadetails?.map((record, index) => (
                        <Row key={index}>
                          <Col lg={3}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                                  errors.areadetails?.at(index)?.value) &&
                                !errors.areadetails?.at(index)?.area && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>
                          <Col lg={3}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                                  errors.areadetails?.at(index)?.area) &&
                                !errors.areadetails?.at(index)?.floor && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>

                          <Col lg={2}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                                  errors.areadetails?.at(index)?.value ||
                                  errors.areadetails?.at(index)?.area) &&
                                !errors.areadetails?.at(index)?.unit && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>

                          <Col lg={3}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                                  errors.areadetails?.at(index)?.area) &&
                                !errors.areadetails?.at(index)?.value && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>

                          <Col lg={1} className="mt-2">
                          <label className="form-view-label" htmlFor="formBasicName">
                      Action
                    </label>
                            <Button
                              type="button"
                              onClick={() => {
                                
                                if ( values.areadetails[index].id !== undefined ) {
                                  const id = values.areadetails[index].id;
                                  setRemoveIndex((ids) => [...ids, id]);
                                }
                                remove(index);
                                if(values.areadetails.length === 1 && index === 0){
                                  push({
                                    floor: "",
                                    unit: "",
                                    value: "",
                                    type: "height",
                                  })
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

                <Row lg={12} className="section-header mx-auto">
                  <Col lg={8}>
                    <h5 style={{ marginTop: "5px" }}>Height Details</h5>
                  </Col>
                </Row>
                <FieldArray name="heightdetails">
                  {({ push, remove }) => (
                    <div>
                      {values.heightdetails?.map((record, index) => (
                        <Row key={index} >
                          <Col lg={3}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                              ? (errors.heightdetails?.at(index)?.unit ||
                                  errors.heightdetails?.at(index)?.value) &&
                                !errors.heightdetails?.at(index)?.floor && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>

                          <Col lg={3}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                              ? (errors.heightdetails?.at(index)?.floor ||
                                  errors.heightdetails?.at(index)?.value) &&
                                !errors.heightdetails?.at(index)?.unit && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>

                          <Col lg={3}>
                          <label className="form-view-label" htmlFor="formBasicName">
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
                              ? (errors.heightdetails?.at(index)?.floor ||
                                  errors.heightdetails?.at(index)?.unit) &&
                                !errors.heightdetails?.at(index)?.value && (
                                  <div className="error-message">
                                    Please enter all values
                                  </div>
                                )
                              : ""}
                          </Col>

                          <Col lg={3} className="mt-2">
                          <label className="form-view-label" htmlFor="formBasicName">
                      Action
                    </label>
                            <Button
                              type="button"
                              onClick={() => {
                               
                                if (values.heightdetails[index].id !== undefined) {
                                  const id = values.heightdetails[index].id;
                                  setRemoveIndex((ids) => [...ids, id]);
                                }
                                remove(index);
                                if(values.heightdetails.length === 1 && index === 0){
                                  push({
                                    area: "",
                                    floor: "",
                                    unit: "",
                                    value: "",
                                    type: "height",
                                  })
                                }
                              }}
                            >
                              {" "}
                              X{" "}
                            </Button>{" "}
                            &nbsp;
                            {index !== values.heightdetails.length - 1 ? (
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

              

                <div className="px-3">
                  <Row lg={12} className="section-header">
                    <Col lg={7}>
                      <h5 style={{ marginTop: "5px" }}>Address Information</h5>
                    </Col>
                  </Row>
                </div>
                <Row>
                  <Col lg={3}>
                    <label>State</label>
                    <Field
                      as="select"
                      name="state"
                      placeholder="State"
                      value={values.state}
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
                      disabled={!values.state}
                      className="Field"
                      placeholder="Enter City"
                      onChange={handleChange}
                      name="city"
                      value={values.city}
                    >
                      <option value="">--Select City--</option>

                      {cityList.length === 0 ? (
                        <option value="Jaipur">Jaipur</option>
                      ) : (
                        <>
                          {cityList &&
                            cityList.map((ele) => (
                              <option value={ele.name}>{ele.name}</option>
                            ))}
                        </>
                      )}
                    </Field>
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error-message"
                    />
                  </Col>

                  <Col lg={3}>
                    <label>Street</label>

                    <Field
                      type="text"
                      name="street"
                      placeholder="Enter street"
                      value={values.street}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col lg={3}>
                    <label>Pincode</label>
                    <Field
                      type="text"
                      name="pincode"
                      placeholder="Enter pincode"
                      value={values.pincode}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="pincode"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={3}>
                    <label>Country</label>
                    <Field
                      disabled
                      className="Field"
                      type="text"
                      name="country"
                      placeholder="Enter country"
                      value="India"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={3}>
                    <label>Google Location</label>
                    <Field
                      type="text"
                      name="googlelocation"
                      placeholder="Enter Google location"
                      value={values.googlelocation}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <div className="px-3">
                  <Row lg={12} className="section-header">
                    <Col lg={7}>
                      <h5 style={{ marginTop: "5px" }}>
                        Office Address Information
                      </h5>
                    </Col>
                  </Row>
                </div>
                <Row>
                  <Col lg={3}>
                    <label>Office State</label>
                    <Field
                      as="select"
                      name="officestate"
                      // defaultValue="Rajasthan"
                      value={values.officestate}
                      onChange={(event) => {
                        var temp = CityState.filter(
                          (ele) => ele.state === event.target.value
                        );
                        setOfcCityList(temp.sort());
                        handleChange(event);
                      }}
                    >
                      <option value="">--Select State--</option>
                      {ofcstateList &&
                        ofcstateList.map((state) => (
                          <option value={state}>{state}</option>
                        ))}
                    </Field>
                  </Col>
                  <Col lg={3}>
                    <label>Office City</label>
                    <Field
                      as="select"
                      disabled={!values.officestate}
                      //className="Field"
                      placeholder="Enter City"
                      onChange={handleChange}
                      name="officecity"
                      value={values.officecity}
                    >
                      <option value="">--Select City--</option>

                      {ofcCityList &&
                        ofcCityList.length > 0 &&
                        ofcCityList.map((ele) => (
                          <option value={ele.name}>{ele.name}</option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="officecity"
                      component="div"
                      className="error-message"
                    />
                  </Col>

                  <Col lg={3}>
                    <label>Office Street</label>
                    <Field
                      type="text"
                      name="officestreet"
                      placeholder="Enter street"
                      value={values.officestreet}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={3}>
                    <label>Office Country</label>
                    <Field
                      disabled
                      className="Field"
                      type="text"
                      name="officecountry"
                      placeholder="Enter country"
                      value="India"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={3}>
                    <label>Office Pincode</label>
                    <Field
                      type="text"
                      name="officepincode"
                      placeholder="Enter pincode"
                      value={values.officepincode}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="officepincode"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                </Row>
                {modalShow && (
                  <ContactNewModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    submitContact={(result) => {
                      setModalShow(false);
                      setDefaultContact([{id: result.id,contactname: result.firstname + '' + result.lastname}])
                      setFieldValue("contactid", result.id);
                      console.log(result.firstname + '' + result.lastname);
                    }}
                  />
                )}
              </Form>
            )}
          </Formik>
        </Col>
     
      </Row>
    </Container>
  );
};

export default PropertyEdit;
