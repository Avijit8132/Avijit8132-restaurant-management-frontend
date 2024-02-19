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

const TableEdit = (props) => {
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
    var tempList = CityState.filter((ele) => ele.state === tables.state);
    setCityList(tempList.sort());
  }, [accounts]);

  const location = useLocation();
  const navigate = useNavigate();
  const [tables, setTables] = useState(location.state ? location.state : {});
  const handleSubmitSave = async (values) => {

    console.log("values --> ",values);

    //========= Logic to perform Create or Edit ======
    let result2 = {};
    if (tables.id) {
      values.id =tables.id;
      result2 = await inventoryApi.saveTable(values);
      if (result2.success) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/tables/${values.id}`, { state: values });
      }
    } else {
      result2 = await inventoryApi.createTable(values);
      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/tables/${result2.id}`, { state: result2 });
      }
    }
  };

  const handleCancel = () => {
    if (tables.id)  navigate("/tables/" + tables.id, { state: tables });
    else navigate("/tables");
  };

  return (
    <Container className="view-form inputbox">
      {location?.state?.id ? (
        <CustomSeparator
          cmpListName="Contacts"
          cmpViewName={tables.firstname + " " + tables.lastname}
          currentCmpName="Edit"
          indexLength="2"
          indexViewLength="3"
          cmpViewUrl={"/tables/" + tables.id}
          url="/tables"
        ></CustomSeparator>
      ) : (
        <CustomSeparator
          cmpListName="Table"
          currentCmpName="Create"
          indexLength="2"
          url="/tables"
        ></CustomSeparator>
      )}
      <Row className="mt-4 mx-2"  >
       
        <Col lg={12} className="ibs-form-section">
          <Formik
            // validationSchema={schemaContactEdit()}
            onSubmit={handleSubmitSave}
            initialValues={contactEditInitialValues(tables)}
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
                    {tables.id ? (
                      <>
                        Edit Table
                        <h4>{tables.firstname + " " + tables.lastname}</h4>
                      </>
                    ) : (
                      "New Table"
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
                      Table Name <b class="red-star">*</b>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={values.name}
                      onChange={handleChange}
                      required
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={4}>
                    <label>Occupancy</label>
                    <Field
                      type="text"
                      name="occupancy"
                      placeholder="Enter Occupancy"
                      value={values.occupancy}
                      onChange={handleChange}
                    />
                    {errors.occupancy && touched.occupancy ? (
                      <div className="form-error">{errors.occupancy}</div>
                    ) : null}
                  </Col>
                </Row>
                <Row className="align-items">
                  <Col lg={4}>
                    <label>
                      Status 
                    </label>
                    <Field
                      type="text"
                      name="status"
                      placeholder="Enter status"
                      value={values.status}
                      onChange={handleChange}
                      required
                    />

                    <ErrorMessage
                      name="status"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={4}>
                    <label>
                    Description 
                    </label>
                    <Field
                      type="textarea"
                      name="description"
                      placeholder="Enter Description"
                      value={values.description}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="description"
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

export default TableEdit;
