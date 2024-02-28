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
import { schemaBookingEdit } from "../common/ValidateSchemaHelper";
import { bookingEditInitialValues } from "../common/InitialValuesHelper";
import { Typeahead } from "react-bootstrap-typeahead";

const BookingEdit = (props) => {
  const [validated, setValidated] = useState(false);
  const [accounts, setAccstateounts] = useState([]);
  const [stateList, setStateList] = useState(false);
  const [cities, setCities] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [defaultContact, setDefaultContact] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [defaultTable, setDefaultTable] = useState([]);
  

  
  useEffect(() => {
    var temp = [];
    CityState.map((ele) => {
      if (!temp.includes(ele.state)) {
        temp.push(ele.state);
      }
    });
    setStateList(temp.sort());
    var tempList = CityState.filter((ele) => ele.state === bookings.state);
    setCityList(tempList.sort());
  }, [accounts]);

  useEffect(() => {
    async function init() {
      const contacts = await inventoryApi.fetchContacts();
      if (contacts && contacts.length) {
        setContactList(contacts);

        setDefaultContact(contacts.filter((contact, index) => {
          return bookings.contactid === contact.id
        }))
        // setDefaultContact([{ id: "", contactname: "" }]);
      } else {
        // setBody([]);
      }

      const tables = await inventoryApi.fetchTable();
      console.log("tables --> ",tables);
      if (tables && tables.length) {
        setTableList(tables.filter((table) => {
          return table.status === "open"
        }));
        setDefaultTable(tables.filter((table, index) => {
          return bookings.tableid === table.id
        }))
      } else {
        // setBody([]);
      }

    }
    init();
  }, []);

  // useEffect(() => {
  //   async function init() {
  //     const table = await inventoryApi.fetchTable();
  //     if (table && table.length) {

  //       console.log("table --> ",table);

  //       setContactList(table);
  //       setDefaultTable([{ id: "", name: "" }]);
  //     } else {
  //       // setBody([]);
  //     }
  //   }
  //   init();
  // }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(location.state ? location.state : {});
  console.log("location.state --> ",location.state);
  console.log("bookings --> ",bookings);

  const handleSubmitSave = async (values) => {
  console.log("inide save");

    //========= Logic to perform Create or Edit ======
    let result2 = {};
    if (bookings.id) {
      values.id =bookings.id;
      result2 = await inventoryApi.saveBooking(values);
      console.log("result",result2);
      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/bookings/${result2.booking.id}`, { state: result2.booking });
      }
    } else {
      result2 = await inventoryApi.createBooking(values);
      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/bookings/${result2.id}`, { state: result2 });
      }
    }
  };

  // const handleSubmitSave = async (values) => {
  //   console.log("inside save");
  
  //   //========= Logic to perform Create or Edit ======
  //   let result2 = {};
  //   if (location.state && location.state.id) {
  //     values.id = location.state.id; // Set the id from location.state
  //     result2 = await inventoryApi.saveBooking(values);
  //     console.log("result", result2);
  //     if (result2) {
  //       PubSub.publish("RECORD_SAVED_TOAST", {
  //         title: "Record Saved",
  //         message: "Record saved successfully",
  //       });
  //       navigate(`/bookings/${result2.id}`, { state: result2 });
  //     }
  //   } else {
  //     result2 = await inventoryApi.createBooking(values);
  //     if (result2) {
  //       PubSub.publish("RECORD_SAVED_TOAST", {
  //         title: "Record Saved",
  //         message: "Record saved successfully",
  //       });
  //       navigate(`/bookings/${result2.id}`, { state: result2 });
  //     }
  //   }
  // };
  

  const handleCancel = () => {
    if (bookings.id)  navigate("/bookings/" + bookings.id, { state: bookings });
    else navigate("/bookings");
  };

  return (
    <Container className="view-form inputbox">
      {location?.state?.id ? (
        <CustomSeparator
          cmpListName="Booking"
          cmpViewName={bookings.auto_number}
          currentCmpName="Edit"
          indexLength="2"
          indexViewLength="3"
          cmpViewUrl={"/bookings/" + bookings.id}
          url="/bookings"
        ></CustomSeparator>
      ) : (
        <CustomSeparator
          cmpListName="Booking"
          currentCmpName="Create"
          indexLength="2"
          url="/bookings"
        ></CustomSeparator>
      )}
      <Row className="mt-4 mx-2"  >
       
        <Col lg={12} className="ibs-form-section">
          <Formik
            validationSchema={schemaBookingEdit()}
            onSubmit={handleSubmitSave}
            initialValues={bookingEditInitialValues(bookings)}
          >
            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
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
                    {bookings.id ? (
                      <>
                        Edit Booking
                        <h4>{bookings.name}</h4>
                      </>
                    ) : (
                      "New Booking"
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
                <Row className="align-items inputbox">
                  <Col lg={4}>
                    <label>
                    Contact Name <b class="red-star">*</b>
                    </label>
                    {/* <Field
                      type="text"
                      name="contact_name"
                      placeholder="Enter Name"
                      value={values.contact_name}
                      onChange={handleChange}
                      required
                    /> */}
                    
                    {contactList.length > 0 ? (
                              <Typeahead
                                required
                                id="basic-typeahead-single2"
                                defaultSelected={defaultContact}
                                name="contactid"
                                labelKey="contactname"
                                options={contactList}
                                onChange={(event) => {
                                  if (event.length > 0) {


                                    console.log("event", event[0].id);
                                    setFieldValue("contactid", event[0].id);
                                    // setContactDetail(
                                    //   contactList.find(
                                    //     (data) => data.id === event[0].id
                                    //   )
                                    // );
                                  } 
                                  // else {
                                  //   setFieldValue("contactid", "");
                                  //   setContactDetail();
                                  // }
                                }}
                                placeholder="Choose a contact..."
                              />
                              ) : (
                                ""
                              )}    
                    

                    <ErrorMessage
                      name="contact_name"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={4}>
                    <label>Table Name</label>
                    {/* <Field
                      type="text"
                      name="table_name"
                      placeholder="Enter Occupancy"
                      value={values.table_name}
                      onChange={handleChange}
                    /> */}


                    {tableList.length > 0 ? (
                              <Typeahead
                                required
                                id="basic-typeahead-single2"
                                defaultSelected={defaultTable}
                                name="tableid"
                                labelKey="name"
                                options={tableList}
                                onChange={(event) => {
                                  if (event.length > 0) {


                                    console.log("event", event[0].id);
                                    setFieldValue("tableid", event[0].id);
                                    // setContactDetail(
                                    //   contactList.find(
                                    //     (data) => data.id === event[0].id
                                    //   )
                                    // );
                                  } 
                                  // else {
                                  //   setFieldValue("contactid", "");
                                  //   setContactDetail();
                                  // }
                                }}
                                placeholder="Choose a table..."
                              />
                              ) : (
                                ""
                              )}      
                    
                    {/* {errors.table_name && touched.table_name ? (
                      <div className="form-error">{errors.table_name}</div>
                    ) : null} */}
                  </Col>
                </Row>
                <Row className="align-items">
                  <Col lg={4}>
                    <label>
                    Numberofperson 
                    </label>
                    <Field
                      type="number"
                      name="numberofperson"
                      placeholder="Enter Description"
                      value={values.numberofperson}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="numberofperson"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                </Row>
                <br/>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingEdit;
