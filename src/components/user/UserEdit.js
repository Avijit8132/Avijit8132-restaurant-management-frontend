import React, { useState, useEffect } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import Select from "react-select";
import jwt_decode from "jwt-decode";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";

const UserEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //const [user, setuser] = useState(location.state);
    const [user, setUser] = useState(location.state ? location.state : {});
    ////.log('user edit', user)
    let name = user.firstname
    const [optionUsers, setOptionUsers] = useState([]);
    const [option, setoption] = useState();
    const [selectedUser, setSelectedUser] = useState('');
    const [validated, setValidated] = useState(false);
    const [show, setShow] = React.useState(false);

    useEffect(() => {

       
        if (user.id) {
            //.log('if call')
            let temp = {}
            temp.value = user.managerid;
            temp.label = user.managername;
            setoption(temp);
        }else{
            let userInfo = jwt_decode(localStorage.getItem('token'));
            //.log('userInfo', userInfo);
            let temp = {}
            temp.value = userInfo.id;
            temp.label = userInfo.username;
            setoption(temp);
        }
        async function init() {
            const result = await inventoryApi.fetchUsers();

            if (result) {
                let ar = [];
                var obj = {};
                obj.value = null;
                obj.label = '--Select--';
                ar.push(obj);
                result.map((item) => {
                    if (item.userrole !== 'USER') {
                        var obj = {};
                        obj.value = item.id;
                        obj.label = item.username;
                        ar.push(obj);
                    }

                });
                setOptionUsers(ar);
            } else {
                setOptionUsers([]);
            }
        }
        init();
    }, []);

    const checkRequredFields = () => {

        ////.log(selectedUser)
        if ((user.firstname && user.firstname.trim() !== '') && user.lastname &&
            user.email && user.userrole && user.phone) {
            return false;
        }


        return true;
    }




    const handleSubmit = async (e) => {
        //.log('handle submit call', user)
        e.preventDefault();

        if (checkRequredFields()) {
            setValidated(true);
            return;
        }

        //========= Logic to perform Create or Edit ======
        let result = {};
        if (user.id) {

            //.log('if updated')
            //.log("check values-->",user)

            result = await inventoryApi.saveUser(user);
            //.log('result save', result)
            ////.log('if create')
            if (result.success) {
                PubSub.publish("RECORD_SAVED_TOAST", {
                    title: "Record Saved",
                    message: "Record saved successfully",
                });
                navigate(`/users/${user.id}`, { state: user });
            }

            else {
                PubSub.publish("RECORD_ERROR_TOAST", {
                    title: "Record Save Error",
                    message: result.errors,
                });
            }
        } else {
            result = await inventoryApi.createUser(user);
            ////.log('result create', result)
            if (result.success) {
                PubSub.publish("RECORD_SAVED_TOAST", {
                    title: "Record Saved",
                    message: "Record saved successfully",
                });
                navigate(`/users/${result.id}`, { state: result });
            } else {
                PubSub.publish('RECORD_ERROR_TOAST', { title: 'Record Save Error', message: result.errors });

            }
        }

    }

    const handleCancel = () => {
        if (user.id) {
            navigate(`/users/${user.id}`, { state: user })

        } else {
            navigate(`/users`)
        }

    }


    const handleChange = (e) => {
        ////.log(e.target.checked)
        ////.log('user', user)
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleActive = (e) => {


        ////.log(e.target.checked)
        setUser({ ...user, [e.target.name]: e.target.checked });

    };



    const handleUsers = (event) => {
        ////.log(event)
        setoption(event);
        setSelectedUser(event)
        setUser({ ...user, managerid: event.value, managername: event.label });
    }

    return (
      <Container className="view-form">
        <Row  className="mt-4" >
          <Col lg={8} className="pb-1 pt-4">
            {location?.state?.id ? (
              <CustomSeparator
                cmpListName="Users"
                cmpViewName={user.firstname + " " + user.lastname}
                currentCmpName="Edit"
                indexLength="2"
                indexViewLength="3"
                cmpViewUrl={"/users/" + user.id}
                url="/users"
              ></CustomSeparator>
            ) : (
              <CustomSeparator
                cmpListName="Users"
                currentCmpName="Create"
                indexLength="2"
                url="/users"
              ></CustomSeparator>
            )}
          </Col>
        </Row>
        <Row className="mt-4 mx-2" >
          <Col lg={12}  className="ibs-form-section">
            <Form
              className="mt-3"
              onSubmit={handleSubmit}
              noValidate
              validated={validated}
            >
              <Row className="view-form-header align-items-center" style={{
                    marginTop: "-10px",
                  }}>
                <Col lg={8}>
                  {user.firstname === undefined ? (
                    <h6>Create User</h6>
                  ) : (
                    <h6>Edit User</h6>
                  )}
                  <h4></h4>
                </Col>
                <Col lg={4} className="d-flex justify-content-end">
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
              <Row className="ibs-form-section">
                <Alert
                  variant="danger"
                  show={show}
                  className="error-alert my-4 "
                >
                  Please fill required fields
                </Alert>
                <Row lg={12} className="mb-4">
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicFirstName">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        First Name
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="firstname"
                        placeholder="Enter firstname"
                        value={user.firstname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicLastName">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicLastName"
                      >
                        Last Name
                      </Form.Label>
                      <Form.Control
                        //style={{ height: "36px" }}
                        required
                        type="text"
                        name="lastname"
                        placeholder="Enter lastname"
                        value={user.lastname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicEmail">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicEmail"
                      >
                        Email
                      </Form.Label>
                      <Form.Control
                        style={{ height: "36px", textTransform: "lowercase" }}
                        type="email"
                        required
                        name="email"
                        placeholder="Enter email"
                        value={user.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPhone">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPhone"
                      >
                        Phone
                      </Form.Label>
                      <Form.Control
                        style={{ height: "36px" }}
                        required
                        type="phone"
                        name="phone"
                        placeholder="Enter phone"
                        value={user.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  {/* {user.joiningdate && user.joiningdate !== '' ?
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPhone">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPhone"
                      >
                        Joining date
                      </Form.Label>
                      <Form.Control
                        style={{ height: "36px" }}
                        type="date"
                        name="joiningdate"
                        placeholder="Enter joining date"
                        value={user.joiningdate }
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>:''
                  } */}
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPhone">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPhone"
                      >
                        Joining date
                      </Form.Label>
                      <Form.Control
                        style={{ height: "36px" }}
                        type="date"
                        name="joiningdate"
                        placeholder="Enter joining date"
                        value={user.joiningdate }
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  {/* {user.leavingdate && user.leavingdate !== '' ?
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPhone">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPhone"
                      >
                        Leaving date
                      </Form.Label>
                      <Form.Control
                        style={{ height: "36px" }}
                        required
                        type="date"
                        name="leavingdate"
                        placeholder="Enter leavingdate"
                        value={user.leavingdate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>:''
                  } */}
                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPhone">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPhone"
                      >
                        Leaving date
                      </Form.Label>
                      <Form.Control
                        style={{ height: "36px" }}
                        type="date"
                        name="leavingdate"
                        placeholder="Enter leavingdate"
                        value={user.leavingdate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {!user.id ? (
                    <Col lg={6}>
                      <Form.Group
                        className="mx-3"
                        controlId="formBasicpassword"
                      >
                        <Form.Label
                          className="form-view-label"
                          htmlFor="formBasicpassword"
                        >
                          Password
                        </Form.Label>
                        <Form.Control
                          style={{ height: "36px" }}
                          required
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          value={user.password}
                          onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter 6 character minimum.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}
                  {!user.id ? (
                    <Col lg={6}>
                      <Form.Group className="mx-3">
                        <Form.Label className="form-view-label">
                          Role
                        </Form.Label>
                        <Form.Select
                          name="userrole"
                          onChange={handleChange}
                          required
                          value={user.userrole}
                        >
                          <option value="">-- Select --</option>
                          <option value="ADMIN">Admin</option>
                          <option value="USER">User</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col>
                    <Form.Group className="mx-3" controlId="formBasicOwner">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicOwner"
                      >
                        Manager
                      </Form.Label>
                      <Select
                        name="ownerid"
                        value={option}
                        className="custom-select username"
                        onChange={handleUsers}
                        options={optionUsers}
                        getOptionValue={(option) => option.value}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mx-3" controlId="formBasicPin">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicPin"
                      >
                        Active
                      </Form.Label>

                      <Form.Check
                        inline
                        name="isactive"
                        type="checkbox"
                        value="true"
                        checked={user.isactive === true}
                        id="inline-checkbox-9"
                        onChange={handleActive}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Row>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
}

export default UserEdit
