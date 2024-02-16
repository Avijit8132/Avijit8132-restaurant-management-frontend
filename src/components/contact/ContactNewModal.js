import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../../api/inventoryApi";
import moment from "moment";
import Select from 'react-select';
import PubSub from 'pubsub-js';
import CityState from "../../constants/CityState.json";

const ContactNewModal = (props) => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [contact, setContact] = useState({});

    const [state, setState] = useState({});
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [accounts, setAccounts ] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let fetchedAccounts = [];
        accounts.map((item) => {
          fetchedAccounts.push({
            label: item.firstname,
            population: 4780127,
            capital: "Montgomery",
            region: "South",
          });
        });
        setOptions(fetchedAccounts);
    
        let defaultValue = location?.state?.state ? location?.state?.state : 'Rajasthan';
        let st = [];
         let filteredCities = [];
         CityState.forEach(function (obj) {
             if (obj.state === defaultValue) {
                 filteredCities.push({
                     label: obj.name,
                     value: obj.name
                 })
             }
             var state = {};
             obj.value = obj.state;
             obj.label = obj.state;
             //////.log(" obj.label >"+ obj.label)
             st.push(obj);
    
         });
         setCities(filteredCities);
         
         let finalStates = {};
         st = st.filter(function(currentObject) {
             if (currentObject.value in finalStates) {
                 return false;
             } else {
                 finalStates[currentObject.value] = true;
                 return true;
             }
         });
         ////.log('st:', st);
         setState(st);
    
        if(location?.state){
         
        }else{
         setContact({ ...contact, city: 'Ajmer',state:'Rajasthan',country:'India'});
        }
            
      }, [accounts]);


      const location = useLocation();

    const handleChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const checkRequredFields = () => {

        /* //.log(contact.firstname);
        //.log(contact.lastname);
        //.log(contact.phone); */

        if (contact && (contact.firstname && contact.firstname.trim() !== '') && (contact.lastname && contact.lastname.trim() !== '') && (contact.phone && contact.phone.trim() !== '')) {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (checkRequredFields()) {
            setValidated(true);
            return;
        }

        //========= Logic to perform Create or Edit ======

        //.log('--Create---');
        let result2 = await inventoryApi.createContact(contact);
        if (result2) {
            PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
            submitContact(result2);
        }
    }

    const submitContact = (result) => {
        props.submitContact(result);
    };

    const handleState = (e) => {
        let filteredCities = [];
        CityState.forEach(function (obj) {
            if (obj.state === e.value) {
                filteredCities.push({
                    label: obj.name,
                    value: obj.name
                })
            }
        });
        setCities(filteredCities);
        setContact({ ...contact, 'state': e.value,'city':"" });
    }

    const handleSelectListChange = (value, name) => {
        ////.log('contact:', lead);
        setContact({ ...contact, [name]: value.value });
        setSelectedCity(value.value);
      
      }

    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                   Add Contact 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Row>
                        <Col lg={12}>
                            <Form
                                className="mt-3" onSubmit={handleSubmit} noValidate validated={validated}
                                controlId="pricebookCreate"
                            >
                                <Row>
                                    <Col>
                                        <Form.Group className="mx-3" controlId="formBasicEmail">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Contact Type
                                            </Form.Label>
                                            <Form.Select
                                                aria-label="Select Contact Type"
                                                name="type"
                                                value={contact.type}
                                                onChange={handleChange}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="Property Owner">Property Owner</option>
                                                <option value="Buyer">Buyer</option>
                                                <option value="Seller">Seller</option>
                                                
                                                <option value="Agent">Agent</option>
                                                <option value="Staff">Staff</option>
                                                {/* style={{ height: '38px' }} */}
                                                {/* <option value="Dr">Dr.</option>
        <option value="Prof">Prof.</option> */}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                </Row>
                                <Row>
                                <Col className="d-flex justify-content-between">
                                        <Form.Group className="mx-3" controlId="formBasicsalutation">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicsalutation"
                                            >
                                                Salutation
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="salutation"
                                                placeholder="Enter salutation"
                                                value={contact.salutation}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </Form.Group>
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
                                                value={contact.firstname}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mx-3" controlId="formBasicLastName">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicLastName"
                                            >
                                                Last Name
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="lastname"
                                                placeholder="Enter lastname"
                                                value={contact.lastname}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
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
                                                Phone
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="phone"
                                                name="phone"
                                                placeholder="Enter phone"
                                                value={contact.phone}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mx-3" controlId="formBasicEmail">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicEmail"
                                            >
                                                Email
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter email"
                                                value={contact.email}
                                                onChange={handleChange}
                                                style={{ height: '38px',textTransform: 'lowercase' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    </Row>
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
                                                type="text"
                                                name="title"
                                                placeholder="Enter title"
                                                value={contact.title}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* <Col lg={6}>
                <Form.Group className="mx-3" controlId="formBasicStreet">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicStreet"
                  >
                    Account
                  </Form.Label>
                  <Typeahead
                    id="basic-example"
                    onChange={setSelected}
                    options={options}
                    placeholder="Search Accounts..."
                    selected={selected}
                    clearButton
                    defaultFilterBy="label"
                    labelKey="label"
                  />
                </Form.Group>
              </Col> */}


<Col lg={6}>
                                <Form.Group className="mx-3" controlId="formBasicState">
                                    <Form.Label
                                        className="form-view-label"
                                        htmlFor="formBasicState"
                                    >
                                        State
                                    </Form.Label>
                                    <Select
                                        placeholder="State"
                                        value={{ label: contact.state, value: contact.state }}
                                        onChange={handleState}
                                        options={state}

                                    >
                                    </Select>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mx-3" controlId="formBasicCity">
                                    <Form.Label
                                        className="form-view-label"
                                        htmlFor="formBasicCity"
                                    >
                                        City
                                    </Form.Label>
                                    <Select options={cities}
                                        placeholder="Enter City"
                                        onChange={(e) => { handleSelectListChange(e, 'city') }}
                                        name="city"
                                        value={{ label: contact.city, value: contact.city }}
                                    />
                                </Form.Group>
                            </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3" controlId="formBasicPin">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicPin"
                                            >
                                                Pincode
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pincode"
                                                placeholder="Enter pincode"
                                                value={contact.pincode}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3" controlId="formBasicCountry">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicCountry"
                                            >
                                                Country
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="country"
                                                placeholder="Enter country"
                                                value={contact.country}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3" controlId="formBasicStreet">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicStreet"
                                            >
                                                Street
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="street"
                                                placeholder="Enter Street"
                                                value={contact.street}
                                                onChange={handleChange}
                                                style={{ height: '38px' }}
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
                <Button variant="success" onClick={handleSubmit}>
                    Save
                </Button>
                <Button onClick={props.onHide} variant="light">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ContactNewModal;
