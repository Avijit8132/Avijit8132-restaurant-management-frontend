

import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "react-bootstrap-typeahead/css/Typeahead.css";
import moment from "moment";
import Select from "react-select";
import jwt_decode from "jwt-decode";
import Confirm from "../common/Confirm";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";


const EventEdit = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [eventRec, setEventRec] = useState(props.eventRec ? props.eventRec : {});
    const [eventRecTargetDate, setEventRecTargetDate] = useState();
    const [selectedUser, setSelectedUser] = useState('');
    const [option, setoption] = useState();
    const [optionUsers, setOptionUsers] = useState([]);
    const [defaultTargetDate, setDefaultTargetDate] = useState(false);


    useEffect(() => {
        
        console.log('eventRec 11',eventRec)
      
            //console.log('if no id call')
            let userInfo = jwt_decode(localStorage.getItem('token'));
            //console.log('userInfo', userInfo);
            // eventRec.ownerid = userInfo.id;
            // eventRec.ownername = userInfo.username;
            let tempValue = {};
            tempValue.value = userInfo.id;
            tempValue.label = userInfo.username;
            setoption(tempValue);
            eventRec.ownerid = userInfo.id;
    

            if(props?.eventRec?.id){
                let temp = {}
                temp.value = props?.eventRec?.ownerid;
                temp.label = props?.eventRec?.ownername;
                
                setoption(temp);
            }else{
                eventRec.priority = 'Low';
                eventRec.status = 'Not Started';
                if(!eventRec.startdatetime){
                eventRec.startdatetime = moment(new Date()).format('MM/DD/YYYY HH:mm');
                eventRec.enddatetime = moment(new Date()).format('MM/DD/YYYY HH:mm');
                eventRec.ownerid = userInfo.id;
                eventRec.ownername = userInfo.username;
                }
            }
            
        async function init() {
            const result = await inventoryApi.fetchUsers();
            if (result) {
                let ar = [];
                result.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.username;
                    ar.push(obj);
                });
                //console.log('ar', ar)
                setOptionUsers(ar);
            } else {
                setOptionUsers([]);
            }
        }
        init();
    }, []);



    const handleChange = (e) => {
      console.log(e.target.value);
      setEventRec({ ...eventRec, [e.target.name]: e.target.value });

      if (e.target.name === "enddatetime") {
        const startTime = new Date(eventRec.startdatetime);
        const endTime = new Date(e.target.value);
        const timeDifference = endTime - startTime;
        const minutesDifference = Math.floor(timeDifference / 60000);
        console.log("minutesDifference", minutesDifference);
        if (minutesDifference >= 15) {
          setDefaultTargetDate(true);
          setErrorMessage("");
        } else {
          setDefaultTargetDate(false);
          setErrorMessage("Minimum time difference is 15 Minutes");
          setEventRec({ ...eventRec, [e.target.name]: e.target.value });
        }
      } else if (e.target.name === "startdatetime") {
        console.log("Invalid date fields",eventRec.enddatetime,e.target.value);
        if (new Date(eventRec.enddatetime) <= new Date(e.target.value)) {
          console.log("e.target.value", e.target.value, eventRec.enddatetime);
          setEventRec({ ...eventRec, [e.target.name]: e.target.value });
          setErrorMessage("Give proper Dates");
        } else {
          setEventRec({ ...eventRec, [e.target.name]: e.target.value });
          setErrorMessage("");
        }
      }
      
    };

    

    const handleDelete = async (e) => {
        setModalShow(true);
    };

    const deleteTask = async (e) => {
        setModalShow(false);
        e.preventDefault();
    

        if (eventRec.id) {
            console.log(eventRec)
            const result = await inventoryApi.deleteTask(eventRec.id);
            console.log('result update:', result);
            if (result) {
                props.deleteEvents(eventRec);
            }
        }
    };


        //console.log('if call', eventRec.startdatetime,option);

        
        


    const checkRequredFields = () => {

        console.log(eventRec.title);
        console.log(eventRec.startdatetime);
        console.log(eventRec.enddatetime);
        console.log(eventRec.status);
        console.log(eventRec.priority);
        console.log("ownerid" , eventRec.ownerid);

        if ((eventRec.title && eventRec.title.trim() !== '') && eventRec.startdatetime && eventRec.enddatetime  &&
            (eventRec.status && eventRec.status.trim() !== '') && (eventRec.priority && eventRec.priority.trim() !== '')) {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        //console.log('if call', eventRec.startdatetime,option);

        if(eventRec.startdatetime === null || eventRec.startdatetime === undefined){
            eventRec.startdatetime = new Date(eventRec.startdatetime).toISOString;
            eventRec.targetdate = new Date(eventRec.startdatetime).toISOString;
            
        }else if (eventRec.enddatetime === null || eventRec.enddatetime === undefined){
            eventRec.enddatetime = new Date(eventRec.enddatetime).toISOString;
        }
        
        e.preventDefault();
        if (checkRequredFields()) {
            setValidated(true);
            return;
        }
        if (isSubmitting) {
            return;
          }
          setIsSubmitting(true);

        if (eventRec.id) {
            console.log('result update')
            console.log(eventRec)
           
            console.log("check->",eventRec.targetdate)
            const result = await inventoryApi.saveTask(eventRec);
            console.log('result update:', result);
            if (result && result.success) {
                /*eventRec['id'] = result.id;
                eventRec['start'] = result.startdatetime;
                eventRec['targetdate'] = result.startdatetime;
                eventRec['end'] = result.enddatetime;
                eventRec['title'] = result.title;
                eventRec['description'] = result.description;
                eventRec['type'] = result.type;
                eventRec['priority'] = result.priority;
                eventRec['status'] = result.status;
                eventRec['ownerid'] = result.ownerid;
                eventRec['ownername'] = result.ownername;*/
                eventRec['start'] = eventRec.startdatetime;
                eventRec['end'] = eventRec.enddatetime;

                submitEvents(eventRec);
                setIsSubmitting(false);

            }
        } else {
            console.log('result insert')
            delete eventRec.parentid;
            delete eventRec.lastmodifieddate;
            console.log('eventRec', eventRec);
            eventRec.type = 'Meeting';

            const result = await inventoryApi.createTask(eventRec);
            
            console.log('result insert', result)
            if (result) {
                PubSub.publish("RECORD_SAVED_TOAST", {
                    title: "Record Saved",
                    message: "Record Saved successfully",
                  });
                eventRec['id'] = result.id;
                eventRec['start'] = result.startdatetime;
                eventRec['targetdate'] = result.startdatetime;
                eventRec['end'] = result.enddatetime;
                eventRec['title'] = result.title;
                eventRec['description'] = result.description;
                eventRec['type'] = result.type;
                eventRec['priority'] = result.priority;
                eventRec['status'] = result.status;
                eventRec['ownerid'] = result.ownerid;
                eventRec['ownername'] = result.ownername;

                submitEvents(eventRec);
            }
        }

    };



    const submitEvents = (eventRec) => {
        props.submitEvents(eventRec);
    };

    const handleUsers = (event) => {
        //console.log(event)
        setoption(event)
        setSelectedUser(event)
        //console.log('eventRec', eventRec)
        setEventRec({ ...eventRec, ownerid: event.value, ownername: event.label });
    }

    return (
      <>
        {modalShow && (
          <Confirm
            show={modalShow}
            onHide={() => setModalShow(false)}
            deleteTask={deleteTask}
            title="Confirm delete?"
            message="You are going to delete the record. Are you sure?"
            table="task"
          />
        )}

        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {eventRec.id ? "Edit Meeting" : "Create Meeting"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="view-form">
              <Form
                className="mt-3"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                controlId="eventRecEdit"
              >
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicTitle">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicTitle"
                      >
                        Title
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="title"
                        disabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY')}
                        placeholder="Enter title"
                        value={eventRec.title}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPriority">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPriority"
                      >
                        Priority
                      </Form.Label>
                      <Form.Select
                        required
                        disabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY')}
                        aria-label="Enter Priority"
                        name="priority"
                        value={eventRec.priority}
                        onChange={handleChange}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Normal">Normal </option>
                        <option value="High">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group
                      className="mx-3"
                      controlId="formBasicTargetdate"
                    >
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicTargetdate"
                      >
                        Start Date Time{" "}
                        {new Date(eventRec.startdatetime).toISOString}
                      </Form.Label>

                      <Form.Control
                        required
                        disabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY')}
                        type="datetime-local"
                        name="startdatetime"
                        min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
                        value={moment(eventRec.startdatetime).format(
                          "YYYY-MM-DDTHH:mm"
                        )}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {errorMessage && (
                      <div className="text-danger">
                        <b>{errorMessage}</b>
                      </div>
                    )}
                  </Col>
                  <Col lg={6}>
                    <Form.Group
                      className="mx-3"
                      controlId="formBasicTargetdate"
                    >
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicTargetdate"
                      >
                        End Date Time{" "}
                        {new Date(eventRec.targetdate).toISOString}
                      </Form.Label>

                      <Form.Control
                        required
                        disabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY')}
                        type="datetime-local"
                        name="enddatetime"
                        min={moment(eventRec.startdatetime)
                          .add(15, "minutes")
                          .format("YYYY-MM-DDTHH:mm")}
                        value={moment(eventRec.enddatetime).add(15, "minutes").format("YYYY-MM-DDTHH:mm")}
                        //defaultValue={defaultTargetDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {errorMessage && (
                      <div className="text-danger">
                        <b>{errorMessage}</b>
                      </div>
                    )}
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicStatus">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicStatus"
                      >
                        Status
                      </Form.Label>
                      <Form.Select
                        required
                        disabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY')}
                        aria-label="Enter status"
                        name="status"
                        value={eventRec.status}
                        onChange={handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="Not Started"> Not Started</option>
                        <option value="In Progress">In Progress </option>
                        <option value="Completed">Completed</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Deferred">Deferred</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicOwner">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicOwner"
                      >
                        Assign Staff
                      </Form.Label>
                      <Select
                        name="ownerid"
                        isDisabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY') ? true : false}

                        value={option}
                        className="username"
                        onChange={handleUsers}
                        options={optionUsers}
                        getOptionValue={(option) => option.value}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={12}>
                    <Form.Group
                      className="mx-3"
                      controlId="formBasicDescription"
                    >
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicDescription"
                      >
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        disabled={moment(eventRec.startdatetime).format('MM/DD/YYYY') < moment(new Date()).format('MM/DD/YYYY')}
                        placeholder="Enter description"
                        value={eventRec.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleSubmit}>
              Save
            </Button>

            {eventRec.id && (
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button onClick={props.onHide} variant="light">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}
export default EventEdit;