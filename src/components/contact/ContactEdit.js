import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import { Field, Formik, ErrorMessage } from 'formik';
import CityState from "../../constants/CityState.json";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import { schemaContactEdit } from "../common/ValidateSchemaHelper";
import { contactEditInitialValues } from "../common/InitialValuesHelper";

const ContactEdit = (props) => {
  const [validated, setValidated] = useState(false);
  const [accounts, setAccstateounts] = useState([]);
  const [stateList, setStateList] = useState(false);
  const [cities, setCities] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    var temp = [];
    CityState.map((ele) => {
      if (!temp.includes(ele.state)) {
        temp.push(ele.state);
      }
    });
    setStateList(temp.sort());
    var tempList = CityState.filter((ele) => ele.state === contact.state);
    setCityList(tempList.sort());
  }, [accounts]);

  const location = useLocation();
  const navigate = useNavigate();
  const [contact, setContact] = useState(location.state ? location.state : {});
  const handleSubmitSave = async (values) => {

    //========= Logic to perform Create or Edit ======
    let result2 = {};
    if (contact.id) {
      values.id =contact.id;
      result2 = await inventoryApi.saveContact(values);
      if (result2.success) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/contacts/${values.id}`, { state: values });
      }
    } else {
      result2 = await inventoryApi.createContact(values);
      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/contacts/${result2.id}`, { state: result2 });
      }
    }
  };

  const handleCancel = () => {
    if (contact.id)  navigate("/contacts/" + contact.id, { state: contact });
    else navigate("/contacts");
  };

  return (
    <Container className="view-form inputbox">
      {location?.state?.id ? (
        <CustomSeparator
          cmpListName="Contacts"
          cmpViewName={contact.firstname + " " + contact.lastname}
          currentCmpName="Edit"
          indexLength="2"
          indexViewLength="3"
          cmpViewUrl={"/contacts/" + contact.id}
          url="/contacts"
        ></CustomSeparator>
      ) : (
        <CustomSeparator
          cmpListName="Contacts"
          currentCmpName="Create"
          indexLength="2"
          url="/contacts"
        ></CustomSeparator>
      )}
      <Row className="mt-4 mx-2"  >
       
        <Col lg={12} className="ibs-form-section">
          <Formik
            validationSchema={schemaContactEdit()}
            onSubmit={handleSubmitSave}
            initialValues={contactEditInitialValues(contact)}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form
                className="mt-3"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                <Row
                  className="view-form-header align-items-center"
                  style={{
                    marginTop: "-10px",
                  }}>
                  <Col lg={3}>
                    {contact.id ? (
                      <>
                        Edit Contact
                        <h4>{contact.firstname + " " + contact.lastname}</h4>
                      </>
                    ) : (
                      "New Contact"
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
                  <Col className="mx-3" lg={6}>
                    <label name> Contact Type </label>
                    <Field
                      as="select"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="Property Owner">Property Owner</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                      <option value="Agent">Agent</option>
                      <option value="Staff">Staff</option>
                    </Field>
                  </Col>
                </Row>
                <Row className="align-items inputbox">
                  <Col lg={4}>
                    <label>Salutation</label>
                    <Field
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
                  <Col lg={4}>
                    <label>
                      First Name <b class="red-star">*</b>
                    </label>
                    <Field
                      type="text"
                      name="firstname"
                      placeholder="Enter firstname"
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
                  <Col lg={4}>
                    <label>
                      {" "}
                      Last Name<b class="red-star">*</b>
                    </label>
                    <Field
                      type="text"
                      name="lastname"
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
                </Row>
                <Row className="align-items">
                  <Col lg={4}>
                    <label>Title</label>
                    <Field
                      as="select"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                    >
                      <option value="">--Select--</option>
                      <option value="CEO">CEO</option>
                      <option value="Director">Director</option>
                      <option value="Manager">Manager</option>
                      <option value="Owner">Owner</option>
                      <option value="Partner">Partner</option>
                      <option value="Executive">Executive</option>
                      <option value="Other">Other</option>
                    </Field>
                  </Col>
                  <Col>
                    <label>Email </label>
                    <Field
                     style={{  textTransform: 'lowercase' }}
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email ? (
                      <div className="form-error">{errors.email}</div>
                    ) : null}
                  </Col>
                  <Col>
                    <label>
                      Phone <b class="red-star">*</b>
                    </label>
                    <Field
                      type="phone"
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
                </Row>
                <br/>
                <Row className="align-items">
                  <Col lg={14} className="section-header" style={{marginLeft:"2px"}}>
                  <h5 style={{marginTop:"5px",marginLeft:"4px"}}>Address Information</h5>
                  </Col>

                  <Col lg={6}>
                    <label>State</label>
                    <Field
                      as="select"
                      name="state"
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
                  <Col lg={6}>
                    <label>City</label>
                    <Field
                      as="select"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                    >
                      <option value="">--Select City--</option>
                      {cityList.length > 0 &&
                        cityList.map((ele) => (
                          <option value={ele.name}>{ele.name}</option>
                        ))}
                      {cityList.length === 0 &&
                       
                          <option value='Jaipur'>Jaipur</option>
                        }
                    </Field>
                  </Col>

                  <Col lg={6}>
                    <label>Street</label>
                    <Field
                      type="text"
                      name="street"
                      placeholder="Enter street"
                      value={values.street}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col lg={6}>
                    <label> Pincode </label>
                    <Field
                      type="number"
                      className="no-arrows"
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
                  <Col lg={6}>
                    <label>Country </label>
                    <Field
                      type="text"
                      name="country"
                      defaultValue={"India"}
                      value={values.country}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactEdit;
