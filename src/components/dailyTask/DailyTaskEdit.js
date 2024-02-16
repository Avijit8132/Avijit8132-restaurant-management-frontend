import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import moment from "moment/moment";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import jwt_decode from "jwt-decode";
import { ErrorMessage, Field, Formik } from "formik";
import { schemaDailyTaskInfo } from "../common/ValidateSchemaHelper";
import { DailyTaskEditInitialValues } from "../common/InitialValuesHelper";

const DailyTaskEdit = (props) => {
  const location = useLocation();
  const [validated, setValidated] = useState(false);
  const [ownerList, setownerList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [defaultOwner, setDefaultOwner] = useState([]);
  const [dailyTask, setDailyTask] = useState(location.state ? location.state : {});
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        let user = jwt_decode(localStorage.getItem("token"));
        //.log("user:", user);
        setUserInfo(user);
      }
    } catch (error) {
      //.log(error);
    }
  }, []);

  useEffect(() => {
    async function init() {
    const result = await inventoryApi.fetchUsers()
    //.log("check fetchUsers",result)
    if (result) {
      setownerList(result);
      if (dailyTask.id) {
        //.log("edit case", dailyTask);
        setDefaultOwner([
          { id: dailyTask.ownerid, username: dailyTask.ownername },
        ]);
      } else {
        //.log("create  case");
        setDefaultOwner([{ id: "", username: "" }]);
      }
    }
  }
  init()
  }, []);

  const handleContact = (selectedOption) => {
    //.log('selectedOption',selectedOption)
    setSelectedUser(selectedOption.username);
  };

  const handleSubmitSave = async (values) => {
    //.log('values',values);

    values.id = dailyTask.id;
    const dailyTaskData = { ...dailyTask };
    try {
      if (dailyTask.id) {
        const result = await inventoryApi.saveDailyTask(values);
        //.log('resultdailytasksave',result);
        PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Updated', message: 'Record updated successfully' });
        // Yamini 23-11-2023
        if(result && location.state.ownerid !== values.ownerid){
          var user = jwt_decode(localStorage.getItem("token"));    
          const taskhistory = {
            "taskid": dailyTaskData.id,
            "name": "Assigned Staff Edited",
            "description": `Assiged Staff is modified from ${location.state.ownername} to ${selectedUser} by ${user.username} on ${moment().format('D/MM/YYYY')}`,
            "field": "Assigned Staff",
            "oldvalue": location.state.ownerid,
            "newvalue": dailyTask.ownerid,
          }
          
         await inventoryApi.saveTaskHistory(taskhistory);
        }
        navigate(`/dailytasklist/${values.id}`, { state: values });

      } else {
        // values = {...values,type: 'dailytask'}
        const result = await inventoryApi.createDailyTask(values);
        //.log('result',result);
        PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
        setDailyTask(result);
        navigate(`/dailytasklist/${result.id}`, { state: result });

      }
  
      // navigate("/dailytasklist/");

    } catch (error) {
      //.error('Error saving/updating task:', error);
    }
  };
  
  const handleCancel = () => {
    if (dailyTask.id)
      navigate("/dailytasklist/" + dailyTask.id, { state: dailyTask });
    else navigate("/dailytasklist");
  };

  return (
    <Container className="view-form inputbox">
      {location?.state?.id ? (
        <CustomSeparator
          cmpListName="Daily Task"
          cmpViewName={dailyTask.title}
          currentCmpName="Edit"
          indexLength="2"
          indexViewLength="3"
          cmpViewUrl={"/dailytasklist/" + dailyTask.id}
          url="/dailytasklist"
        >
         {" "}
        </CustomSeparator>
      ) : (
        <CustomSeparator
          cmpListName="Daily Task"
          currentCmpName="Create"
          indexLength="2"
          url="/dailytasklist"
        >
        </CustomSeparator>
      )}
      <Row className="mt-4 mx-2">
        <Col lg={12} className="ibs-form-section" >
          <Formik
            validationSchema={schemaDailyTaskInfo()}
            onSubmit={handleSubmitSave}
            initialValues={DailyTaskEditInitialValues(dailyTask)}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
              setFieldValue,
            }) => (
              <Form className="" noValidate validated={validated}>
                <Row className="view-form-header align-items-center">
                  <Col lg={3}>
                    {dailyTask.id ? (
                      <>
                        Edit Daily Task
                        <h4>{dailyTask.title}</h4>
                      </>
                    ) : (
                      "New Daily Task"
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
                  <Col lg={6}>
                    <label>
                      Title<b class="red-star">*</b>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      placeholder="Enter Title"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>

                    <label>
                      Priority<b class="red-star">*</b>
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      value={values.priority}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      onChange={handleChange}
                    >
                      <option value="">--Select Priority--</option>
                      <option value="Low">Low </option>
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Field>
                    <ErrorMessage
                      name="priority"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <label>
                      Status<b class="red-star"></b>
                    </label>
                    <Field
                      as="select"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <option value="">--Select Status--</option>
                      <option value="Completed">Completed</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Not Done">Not Done</option>
                      <option value="Due">Due</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                      Target Date<b class="red-star"></b>
                    </label>
                    <Field
                      type="date"
                      name="targetdate"
                      value={values.targetdate}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      onChange={handleChange}
                    ></Field>
                    <ErrorMessage
                      name="targetdate"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                <label>
                  Assign Staff<b class="red-star"> *</b>
                </label>
                <Field
                  as="select"
                  name="ownerid"
                  value={values.ownerid}
                  defaultValue={defaultOwner}
                  onChange={(e) => {handleChange(e); 
                    const selectedValue = e.target.value;
                    const selectedOption = ownerList.find(user => user.id === selectedValue);
                    handleContact(selectedOption);
                    setDailyTask({ ...dailyTask, ownerid: selectedValue }); ;}}
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
            <Col lg={6}>
                    <label>
                    Emails Received<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="emailsreceived"
                      placeholder="Enter Emails Received"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="emailsreceived"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Emails replied except Proposal send (No.)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="emailsrepliedexceptproposalsend"
                      placeholder="Enter Emails replied except Proposal send (No.)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="emailsrepliedexceptproposalsend"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Under construction Properties (Code & Target Dates)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="underconstructionproperties"
                      placeholder="Enter  Under construction Properties (Code & Target Dates)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="underconstructionproperties"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Follow up Taken (Code)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="followuptaken"
                      placeholder="Enter Follow up Taken (Code)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="followuptaken"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Completion of construction (Code)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="completionofconstruction"
                      placeholder="Enter Completion of construction (Code)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="completionofconstruction"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Seller Lead generated (No.)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="sellerleadgenerated"
                      placeholder="Enter  Seller Lead generated (No.)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="sellerleadgenerated"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Seller Lead confirmed (No.)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="sellerleadconfirmed"
                      placeholder="Enter Seller Lead confirmed (No.)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="sellerleadconfirmed"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Follow up taken from Potential Sellers (No.)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="followuptakenfrompotentialsellers"
                      placeholder="Enter  Follow up taken from Potential Sellers (No.)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="followuptakenfrompotentialsellers"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    PPT (Inventory Code)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="ppt"
                      placeholder="Enter PPT (Inventory Code)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="ppt"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Proposal Send (Name)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="proposalsend"
                      placeholder="Enter Proposal Send (Name)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="proposalsend"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Online Platform update (Name)<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="onlineplatformupdate"
                      placeholder="Enter Online Platform update (Name)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="onlineplatformupdate"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Client Databased updated<b class="red-star"></b>
                    </label>
                    <Field
                      as ='select'
                      name="clientdatabasedupdated"
                      placeholder="Enter Client Databased updated (Y/N)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    >
                      <option>--select--</option>
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </Field>
                    <ErrorMessage
                      name="clientdatabasedupdated"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    CRM Update<b class="red-star"></b>
                    </label>
                    <Field
                     as='select'
                      name="crmupdate"
                      placeholder="Enter CRM Update (Y/N)"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                      >
                      <option>--select--</option>
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </Field>
                    <ErrorMessage
                      name="crmupdate"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Other Work 1<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="otherwork1"
                      placeholder="Enter Other Work 1"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="otherwork1"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Other Work 2<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="otherwork2"
                      placeholder="Enter Other Work 2"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="otherwork2"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Other Work 3<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="otherwork3"
                      placeholder="Enter Other Work 3"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="otherwork3"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>
                    Other Work 4<b class="red-star"></b>
                    </label>
                    <Field
                      type="text"
                      name="otherwork4"
                      placeholder="Enter Other Work 4"
                      onChange={handleChange}
                      disabled={userInfo.userrole !== 'SUPER_ADMIN' && dailyTask.id ? true : false}
                      required
                    />
                    <ErrorMessage
                      name="otherwork4"
                      component="div"
                      className="error-message"
                    />
                  </Col>

                  <Col lg={6}>
                    <label>Details</label>
                    <Field
                      className="textarea"
                      as="textarea"
                      name='details'
                      placeholder="Enter Details"
                    />
                  </Col>
                  <Col lg={6}>
                    <label>Description</label>
                    <Field
                      className="textarea"
                      as="textarea"
                      name='description'
                      placeholder="Enter description"
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default DailyTaskEdit;
