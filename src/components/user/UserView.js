import React, { useState, useEffect } from "react";
import inventoryApi from "../../api/inventoryApi";

import { Button, Card, Col, Container, Form, Modal, Row, Tab, Tabs,Tooltip,OverlayTrigger } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PubSub from 'pubsub-js';
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import FilesCreate from "../FilesCreate";
import RelatedListFiles from "../RelatedListFiles";
import TaskEdit from "../task/TaskEdit";
import RelatedListTask from "../task/RelatedListTask";
import moment from "moment";

const UserView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state ? location.state : {});
  //.log("Verify-->",user)
  const [locationHistorysTab, setLocationHistorysTab] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [relatedListTasks, setRelatedListTasks] = useState(true);
  const [modalShowTask, setModalShowTask] = useState(false);

  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [relatedListFiles, setRelatedListFiles] = useState(false);
  const [refreshTaskList, setRefreshTaskList] = useState(Date.now());

  const [files, setFiles] = useState([]);
  const [refreshFileList, setRefreshFileList] = useState();
  ////.log('user', user)


  useEffect(() => {
    fetchUserById()
  }, []);

  const submitTasks = () => {
    setModalShowTask(false);
    setRefreshTaskList(Date.now());
  };

  const handlePasswordOnchange = (e) => {
    ////.log(e.target.value)
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const fetchUserById = () => {

    if (location.hasOwnProperty('pathname') && location.pathname.split('/').length >= 3) {
      user.id = location.pathname.split('/')[2];
      ////.log('user.id',user.id)
    }
    
    async function inituser() {
      let result = await inventoryApi.fetchUserById(user.id);
      //.log('result fetch by id', result)
      setUser(result);
    }
    inituser();
  };
  const editUser = (row) => {
    ////.log("row", row);
    navigate(`/users/${user.id}/e`, { state: user });
  }

  const handleSelect = (key) => {
  if (key === 'login history') {
      setLocationHistorysTab(true);
     
    }
  }

  const handleChangeSubmit = async (e) => {
    ////.log('user', user);
  
    e.preventDefault();
    ////.log('userId', userId);
    //.log('user', user)

    if (user.password === user.confirmpassword && user.password !== '') {
      let newUser = {id : user.id, password : user.password};
      const result = await inventoryApi.saveUser(newUser);
      setShowPasswordModal(false)
      PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Password updated successfully' });
      ////.log('result', result);
    } else {
      PubSub.publish('RECORD_ERROR_TOAST', { title: 'Record Saved Error', message: 'Either password do not match or not entered' });
      ////.log('Password is null, please enter a valid password.');
    }
  };

  const handleClose = () => setShowPasswordModal(false);

  const filesList = () => {
    async function init() {
      let file = await inventoryApi.fetchFiles(user.id);
      if (file && file?.length > 0) {
        setFiles(file);
      } else {
        setFiles([]);
      }
    }
    init();
  };

  const submitfiles = () => {
    setModalShowFile(false);
    setFiles([]);
    setRefreshFileList(Date.now());
    filesList();
  };

  return (
    <div>

      <Container>
      <Modal show={showPasswordModal} onHide={handleClose} className= "modal-sm"> 
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col></Col>
            <Col lg={12}>
              <Form >
                <Row>
                  <Col>
                    <Form.Group className="mx-3" controlId="formBasicFirstName">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter Your password"
                        onChange={handlePasswordOnchange}
                        required
                      />
                    </Form.Group>
                  </Col>

                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mx-3" controlId="formBasicPhone">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPhone"
                      >
                        Confirm Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmpassword"
                        placeholder="Enter confirm password"
                        onChange={handlePasswordOnchange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

              </Form>
            </Col>
            <Col></Col>
          </Row>


        </Modal.Body>
        <Modal.Footer>

          <Button variant="primary" onClick={handleChangeSubmit}>
            Save
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="view-form">
         
         <Col lg={11} className="pb-3 pt-2">
         <CustomSeparator 
      cmpListName="Users"
      currentCmpName={user.firstname + " " + user.lastname}
      indexLength="2"
      url="/users" > 
      </CustomSeparator>
     </Col>
     <Col></Col>
           </Row>
        <Row className="view-form">
          
          <Col></Col>
          <Col lg={8}>
            <Row className="view-form-header align-items-center">
              <Col lg={3}>
                User
              </Col>
              <Col lg={9} className="d-flex justify-content-end">
              <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                >
                <Button className="btn-sm mx-2" onClick={() => editUser(true)}>
                  <i class="fa-regular fa-pen-to-square"></i>
                </Button>
                </OverlayTrigger>
                <Button className="btn"  variant="danger" onClick={(e) => {setShowPasswordModal(true)}}>
                Reset Password
              </Button>
              </Col>
            </Row>
            <Row className="ibs-form-section">

           

              <Col lg={6}>
                <label>First Name</label>
                <span>{user.firstname}</span>
              </Col>
              <Col lg={6}>
                <label>Last Name</label>
                <span>{user.lastname}</span>
              </Col>
              <Col lg={6}>
                <label>Email</label>
                <span>{user.email}</span>
              </Col>
              <Col lg={6}>
                <label>Phone</label>
                <span>{user.phone}</span>
              </Col>
              <Col lg={6}>
                <label>Joining date</label>
                <span>{user.joiningdate}</span>
              </Col>
              <Col lg={6}>
                <label>Leaving date</label>
                <span>{user.leavingdate}</span>
              </Col>
              <Col lg={6}>
                <label>User Role</label>
                <span>{user.userrole}</span>
              </Col>
              <Col lg={6}>
                <label>Manager</label>
                <span>{user.managername}</span>
              </Col>
              <Col lg={6}>
                <label>Active</label>
                <span>{user.isactive  === true && (<i class="fa-regular fa-square-check" style={{fontSize: "1.3rem"}}></i>)}  {user.isactive  === false && (<i class="fa-regular fa-square" style={{fontSize: "1.3rem"}}></i>)}  </span>
              </Col>
            </Row>
          </Col>
          <Col></Col>
        </Row>


          <Card bg="light" text="light" className="mb-2 mt-4">
            <Card.Header className="d-flex justify-content-between">
              <Tabs defaultActiveKey="files" id="uncontrolled-tab-example">
              <Tab eventKey="files" title="Files"></Tab>
              </Tabs>
                {<Button
                  className="float-right btn-sm"
                  onClick={() => setModalShowFile(true)}
                >
                  Upload File
                </Button>}
        
              {modalShowTaskfile && (
                <FilesCreate
                  show={modalShowTaskfile}
                  onHide={() => setModalShowFile(false)}
                  parent={user}
                  table="contact"
                  submitfiles={submitfiles}
                />
              )}
            </Card.Header>
            <Card.Body>
              {user && user.id}
              <RelatedListFiles
                files={files}
                refreshFileList={refreshFileList}
                parent={user}
              />
            </Card.Body>
          </Card>
      </Container>
    </div>
  )
}

export default UserView
