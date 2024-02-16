import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import moment from "moment";
import PubSub from 'pubsub-js';

const TaskEdit = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [task, setTask] = useState(props.task ? props.task.row : { parentid: props.parentid, parenttype: props.table });
    //.log('task',task,props);
    const [taskTargetDate, setTaskTargetDate] = useState();
    useEffect(() => {
        if (props.parentid !== null && props.task !== null) {
            let current = new Date();
            task.lastmodifieddate = moment(current).format('YYYY-MM-DD');
        }
    }, []);

    //===typeahead===
    const [ownerList, setownerList] = useState([]);
    const [defaultOwner, setDefaultOwner] = useState([]);
    const [defaultTargetDate, setDefaultTargetDate] = useState(new Date());
    useEffect(() => {
        async function init() {
            const result = await inventoryApi.fetchUsers();
            if(result) {
                setownerList(result);
                if(task.id){
                    setDefaultOwner([{'id':task.ownerid, 'username':task.ownername}]);
                } else {
                    setDefaultOwner([{'id':'', 'username':''}]);
                    setDefaultTargetDate(new Date()); 
                    task.targetdate = defaultTargetDate;
                }
            }
            }
            init();
    }, []);

    const handleOwnerName = (event) => {
        if(event.length > 0){
            //.log('true');
            setTask({ ...task, ownerid:event[0].id});
        } else {
            //.log('false');
            setTask({ ...task, ownerid:''});
        }
    }
    //=== /-typeahead ====
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
        
        if(e.target.name === 'targetdate'){
            if(new Date(e.target.value) < currentDate){
                setTask({ ...task, [e.target.name]: null });
                setErrorMessage("Target date should be greater than or equal to today's date");
            }
            else{
                setTask({ ...task, [e.target.name]: e.target.value });
                setErrorMessage('');
            }
        }
        
        
    };

    const checkRequredFields = () => {

        //.log(task.title);
        //.log(task.targetdate); 
        //.log(task.status);
        //.log(task.priority);
        //.log(task.ownerid);
        
       
 
        if((task.title && task.title.trim() !== '') &&  
           (task.status && task.status.trim() !== '') && (task.priority && task.priority.trim() !== '') &&
           (task.ownerid && task.ownerid.trim() !== '')) {
             return false;
        } 
        return true;
     }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkRequredFields()) {
            setValidated(true);
            return;
        }
      //.log('handlesubmit',task);
        if(task.id){
            const result = await inventoryApi.saveTask(task);
            //.log('result:', result);
            if (result) {
                PubSub.publish('RECORD_SAVED_TOAST', {title: 'Record Saved', message: 'Record update successfully'});
                submitTasks();
            }
        }else{
            const result = await inventoryApi.createTask(task);
            if (result) {
                PubSub.publish('RECORD_SAVED_TOAST', {title: 'Record Saved', message: 'Record saved successfully'});
                submitTasks();
            }
        }
            
        
    };

    const submitTasks = () => {
        props.submitTasks();
    };

    return (
    

        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  {task.id ? "Edit Task" : "Add Task"}  
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Row>
                        <Col lg={12}>
                            <Form noValidate validated={validated} onSubmit={handleSubmit} controlId="taskEdit">
                                <Row>
                                    <Col>
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
                                                placeholder="Enter title"
                                                value={task.title}
                                                onChange={handleChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mx-3" controlId="formBasicType">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicType"
                                            >
                                                Type
                                            </Form.Label>
                                            <Form.Select
                                                aria-label="Enter Payment Status"
                                                name="type"
                                                value={task.type}
                                                onChange={handleChange}
                                            >
                                                <option value=''>--Select--</option>
                                                <option value="Call">Call </option>
                                                <option value="Task">Task</option>
                                                <option value="Meeting">Meeting</option>
                                                <option value="Notes">Notes</option>
                                                
                                                {task.type == 'Email' ? <option value="Email">Email</option> : " "}
                                            </Form.Select>
                                            
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mx-3" controlId="formBasicPriority">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicPriority"
                                            >
                                                Priority
                                            </Form.Label>
                                            <Form.Select required aria-label="Enter Priority" name="priority" value={task.priority} onChange={handleChange}>
                                                <option value="">Select Priority</option>
                                                <option value="Low">Low</option>
                                                <option value="Normal">Normal </option>
                                                <option value="High">High</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mx-3" controlId="formBasicStatus">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicStatus"
                                            >
                                                Status
                                            </Form.Label>
                                            <Form.Select required aria-label="Enter status" name="status" value={task.status} onChange={handleChange}>
                                                <option value="">Select Status</option>
                                                <option value="Not Started">Not Started</option>
                                                <option value="In Progress">In Progress </option>
                                                <option value="Completed">Completed</option>
                                                <option value="Waiting on someone else">Waiting on someone else</option>
                                                <option value="Deferred">Deferred</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    
                                    <Col >
                                        <Form.Group className="mx-3" controlId="formBasicTargetdate">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicTargetdate"
                                            >
                                                Target date {new Date(task.targetdate).toISOString}
                                            </Form.Label>

                                            <Form.Control
                                                required
                                                type="date"
                                                name="targetdate"
                                                placeholder="Enter targetdate"
                                                value={moment(task.targetdate).format('YYYY-MM-DD')}
                                                defaultValue={defaultTargetDate}
                                                min={moment(new Date()).format('YYYY-MM-DD')}
                                                onChange={handleChange}
                                            />
                                             {errorMessage && (
                                                <div className="text-danger">
                                                    <b>{errorMessage}</b>
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col >
                                    <Form.Group className="mx-3" controlId="formBasicOwner">
                                        <Form.Label className="form-view-label" htmlFor="formBasicOwner" >
                                            Assign Staff
                                        </Form.Label>
                                        
                                        {defaultOwner.length > 0 ?
                                                <Typeahead
                                                    id="basic-typeahead-single"
                                                    defaultSelected={defaultOwner}
                                                    name="owner"
                                                    labelKey="username"
                                                    options={ownerList}
                                                    onChange={handleOwnerName}
                                                    placeholder="Choose a state..."
                                                />
                                          : ''}
                                       
   
	{/* 
	<Form.Select aria-label="Select Assignee" name="ownerid" value={lead.ownerid} onChange={handleChange}>
		<option value="">--Select--</option>
		{ownerList}
	</Form.Select>
	*/}
</Form.Group>



                                     {/*<Form.Group className="mx-3" controlId="formBasicOwner">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicTitle"
                                            >
                                                Assigned To
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ownerid"
                                                placeholder="Select Owner"
                                                value={task.ownerid}
                                                onChange={handleChange}

                                            />
                                        </Form.Group>
                                    */}
                                    </Col> 
                            
                                    <Col lg={12}>
                                        <Form.Group className="mx-3" controlId="formBasicDescription">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicDescription"
                                            >
                                                Description
                                            </Form.Label>
                                            <Form.Control
                    as="textarea"
                    name="description"
                    placeholder="Enter description"
                    value={task.description}
                    onChange={handleChange}
                  />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit}  >Save</Button>
                <Button onClick={props.onHide} variant="light">Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default TaskEdit;
