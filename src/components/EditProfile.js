import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CardHeader from "react-bootstrap/esm/CardHeader";
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal';
import PubSub from 'pubsub-js';
import inventoryApi from "../api/inventoryApi";
import authApi from "../api/authApi";
import CustomSeparator from "./Breadcrumbs/CustomSeparator";

const EditProfile = ({ userId }) => {
  const fileInputRef = useRef();
  const [profile, setProfile] = useState({});
  const [body, setBody] = useState();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({ password: '', confirmpassword: '' });
  const [validated, setValidated] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState();

  useEffect(()=>{
    var dataImage = localStorage.getItem('myimage');
    let bannerImg = document.getElementById('profile-image');
    if(localStorage.getItem('myimage') !== '/img_avatar.png'){
      
      bannerImg.src = "data:image/png;base64," + dataImage;
    }else{
      setBody('/img_avatar.png')
      bannerImg.src = localStorage.getItem('myimage');
    }
   

  }, [localStorage.getItem('myimage')])

  useEffect(() => {
    async function init() {
      let result = await inventoryApi.getLoginUserData();
      setProfile(result);
      //.log('result:', result);
      //setBody(localStorage.getItem("myimage"));
      // let files = await inventoryApi.fetchFiles(result.id);
      // setFile(files.id)
      // //setSelectedFiles(files);
      // ////.log('FILES', files[0])
      // if (files && files.length > 0) {
      //   let file = files[0];
      //   let downloadresult = await inventoryApi.downloadFiles(file.id);
      //   ////.log('result:', downloadresult);
      //   file.body = window.URL.createObjectURL(downloadresult);
      //   ////.log(file.body);
      //   setBody(file.body);
      // }
    }

    init();
  }, []);

  const handlePasswordOnchange = (e) => {
    ////.log(e.target.value)
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    ////.log('value ki value >>> ', e, "=>", e.target.value)
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    //.log('selected file', selectedFiles)
    console.log('profile', profile)
    let result = {};
    if (selectedFiles === null) {
      ////.log('selected file');
      result = await inventoryApi.saveUser(profile);
      ////.log('result save', result)
      if (result.success) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record update successfully",
        });
      }
      else {
        PubSub.publish("RECORD_ERROR_TOAST", {
          title: "Record Save Error",
          message: result.errors,
        });
      }
    } else {
      let result = await inventoryApi.saveStaffMemberEditProfile(profile.id, selectedFiles, JSON.stringify(JSON.stringify(profile)));
      //.log("result " , result);


      let data =  await authApi.fetchMyImage();
        //.log('data',data)
        if(data){
          blobToBase64(data).then((base64String)=>{
            //.log("base64String" , base64String.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""))
            localStorage.setItem("myimage", base64String.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
          });
        }
        else{
          localStorage.setItem("myimage", "/img_avatar.png");
        }

      // localStorage.setItem('myimage',body);
      ////.log('file update', result);
      PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: ' Record update successfully' });

    }
  }
  const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const handlePhotoUpload = (event) => {
    setBody(URL.createObjectURL(event.target.files[0]));
    setSelectedFiles(event.target.files[0]);
  };

  

  const handleClose = () => setShow(false);


  const handleChangeSubmit = async (e) => {
    ////.log('user', user);
    setShow(true)
    e.preventDefault();
    ////.log('userId', userId);
    ////.log('user', user)
    if (user.password === user.confirmpassword && user.password !== '') {
      const result = await inventoryApi.updateUser(user);
      setShow(false)
      PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Password updated successfully' });
      ////.log('result', result);
    } else {
      ////.log('Password is null, please enter a valid password.');
    }
  };


  const handleRemovePhoto = async () => {
    try {
      const result = await inventoryApi.deleteImage();
      
      if (result.success) {
        // Update the local state and storage on successful removal
        setBody('/img_avatar.png');
        setSelectedFiles(null);
        localStorage.setItem('myimage', '/img_avatar.png');
      } else {
        //.error('Error removing photo from the database:', result.errors);
      }
    } catch (error) {
      //.error('An unexpected error occurred:', error);
    }
  };
  return (
    <Container>

      <CustomSeparator
        currentCmpName="Profile"
        indexLength="0"
        url="/profile"
      ></CustomSeparator>
      <Row></Row>
      <Row className="pt-4">
        <Col lg={1}></Col>
        <Col lg={3}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title style={{ textAlign: "center" }}>
                {profile.firstname} {profile.lastname}
              </Card.Title>
              <Image variant="top"
                id="profile-image"
                src={body}
                className="rounded-circle w-80"
                thumbnail
               ></Image>
              <br />
              {/* <Button
                  className="btn my-3 "
                  onClick={handleRemovePhoto}
                  variant="danger" style={{ width: "100%", display: "block" }}
                >
                  Remove Image
                </Button> */}
                {body !== '/img_avatar.png' && (
        <Button
          className="btn my-3 "
          onClick={handleRemovePhoto}
          variant="danger"
          style={{ width: "100%", display: "block" }}
        >
          Remove Image
        </Button>
      )}
              <Button className="btn my-3 " variant="secondary" style={{ width: "100%", display: "block" }} onClick={() => fileInputRef.current.click()}>
                Image Upload
              </Button>
             
              <Button className="btn" style={{ width: "100%", display: "block" }} variant="primary" onClick={handleChangeSubmit}>
                Change Password
              </Button>
              <input
                onChange={handlePhotoUpload}
                name="profilephotourl"
                accept="image/*"
                ref={fileInputRef}
                type="file"
                hidden
              />
            </Card.Body>
          </Card>
        </Col>

        <Col style={{ backgroundColor: "#fff" }} lg={7}>
          <Row className="view-form-header align-items-center">
            <Col lg={6}>
             Edit Profile
            </Col>
            <Col lg={6} className="d-flex justify-content-end">
              <Button className="btn-sm mx-2" onClick={handleSubmit}>
                Save
              </Button>
            </Col>
          </Row>

          <Row className="pb-5 py-3">
            <Col lg={6}>
              <Form.Group className="mx-3 mb-3" controlId="formBasicPhone">
                <Form.Label
                  className="form-view-label"
                  htmlFor="formBasicPhone"
                >
                  First Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={profile.firstname}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group
                className="mx-3 mb-3"
                controlId="formBasicLastName"
              >
                <Form.Label
                  className="form-view-label"
                  htmlFor="formBasicPhone"
                >
                  Last Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  placeholder="Enter Last Name"
                  value={profile.lastname}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group
                className="mx-3 mb-3"
                controlId="formBasicLastEmail"
              >
                <Form.Label
                  className="form-view-label"
                  htmlFor="formBasicPhone"
                >
                  Email
                </Form.Label>
                <Form.Control
                 style={{  textTransform: 'lowercase' }}
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group
                className="mx-3 mb-3"
                controlId="formBasicLastName"
              >
                <Form.Label
                  className="form-view-label"
                  htmlFor="formBasicPhone"
                >
                  Phone
                </Form.Label>
                <Form.Control
                  type="phone"
                  name="phone"
                  placeholder="Enter Phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
        <Col lg={1}></Col>
      </Row>

    <Modal show={show} onHide={handleClose} className= "modal-sm"> 
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col></Col>
            <Col lg={12}>
              <Form className="mt-3" >
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




    </Container>
  );
};

export default EditProfile;
