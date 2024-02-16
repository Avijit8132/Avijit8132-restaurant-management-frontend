import React, {useState} from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import authApi from "../api/authApi";
import * as constants from '../constants/CONSTANT';


const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({email: "", password : ""});
  const [show, setShow] = React.useState(false);
  const [errorMessage,setErrorMessage] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    //.log(credentials)


    const result = await authApi.login(credentials.email, credentials.password)
    if (result.success) {
      localStorage.setItem("token", result.authToken);
      localStorage.setItem('lead_status',JSON.stringify(constants.LEAD_STATUS_VALUES));
      localStorage.setItem('contact_type',JSON.stringify(constants.Contact_Type));
      //navigate("/");
      
        
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

        
        
          // if(data)
          //   localStorage.setItem("myimage", URL.createObjectURL(data));
          // else
          //   localStorage.setItem("myimage", "/img_avatar.png");
       
        
        
          window.location.href = '/'
    }else {
      
      setShow(true);
      setErrorMessage(result.errors);

    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <Row className="login-form p-3 mt-5">
        <Col lg={6}>
          <img src="login.png" />
        </Col>
        <Col lg={6} className="login-section">
          <h3 className="text-center mb-2 pt-5">

            <img src="/sthapathya-logo.png" style={{width: "200px"}}/>
          </h3>
          <div className="p-4">
            <Form onSubmit={handleSubmit}>
              <div className="mt-2 text-center mb-4">
                <i className="fa-solid fa-lock-open fa-2xl"></i>
                <h3 className="mt-2">Login</h3>
              </div>
              <Alert variant="danger" show = {show}>{errorMessage}</Alert>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                  value={credentials.email}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  value={credentials.password}
                />
              </Form.Group>
              
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
      <center className="m-4"><img src="indicrmgrb.png" style={{width:"12rem"}}/></center>
    </Container>
  );
};

export default Login;