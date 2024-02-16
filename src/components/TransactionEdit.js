import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../api/inventoryApi";
import moment from "moment";
import PubSub from "pubsub-js";


const TransactionEdit = (props) => {
  const [validated, setValidated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionRec, settransactionRec] = useState({});
  const [transactionRecTargetDate, settransactionRecTargetDate] = useState();

  //===typeahead===
  const [ownerList, setownerList] = useState([]);
  const [defaultOwner, setDefaultOwner] = useState([]);
  const [defaultTargetDate, setDefaultTargetDate] = useState(new Date());
  useEffect(() => {
    if (props?.transaction !== null && props?.transaction.id) {
      let current = new Date();
      //.log("Edit", props.transaction);
      settransactionRec(props.transaction);
      //transactionRec.lastmodifieddate = moment(current).format('YYYY-MM-DD');
    } else {
      //.log("Create ", props.transaction);
      settransactionRec({ type: props.type });
    }
  }, []);

  const handleOwnerName = (transactionRec) => {
    if (transactionRec.length > 0) {
      //.log("true");
      settransactionRec({ ...transactionRec, ownerid: transactionRec[0].id });
    } else {
      //.log("false");
      settransactionRec({ ...transactionRec, ownerid: "" });
    }
  };
  //=== /-typeahead ====

  const handleChange = (e) => {
    settransactionRec({ ...transactionRec, [e.target.name]: e.target.value });
  };

  const checkRequredFields = () => {
    //.log(transactionRec.title);
    //.log(transactionRec.transactiondate);
    //.log(transactionRec.status);
    //.log(transactionRec.category);

    if (
      transactionRec.title &&
      transactionRec.title.trim() !== "" &&
      transactionRec.transactiondate &&
      transactionRec.status &&
      transactionRec.status.trim() !== "" &&
      transactionRec.category &&
      transactionRec.category.trim() !== ""
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkRequredFields()) {
      setValidated(true);
      return;
    }
    transactionRec.paymentstatus = transactionRec.status;
    if (props?.transaction && props.transaction?.id) {
      const result = await inventoryApi.savetransactionRec(transactionRec);
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: "Record saved successfully",
      });
      //.log("result:", result);
    } else {
      const result = await inventoryApi.createTransaction(transactionRec);
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: "Record saved successfully",
      });
    }
    submitEvents(transactionRec);
  };

  const submitEvents = (transactionRec) => {
    ////.log('transactionRec:', transactionRec);
    
    props.submitEvents(transactionRec);
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.type === "Income"
            ? transactionRec?.id
              ? "Edit Income"
              : "Add Income"
            : ""}
          {props.type === "Expense"
            ? transactionRec?.id
              ? "Edit Expense"
              : "Add Expense"
            : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="view-form">
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            controlId="transactionRecEdit"
          >
            <Row>
              <Col lg={6}>
                <Form.Group className="mx-3" controlId="formBasicTitle">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicTitle"
                  >
                    Transaction Type
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="type"
                    value={transactionRec.type}
                    disabled
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
                    Category
                  </Form.Label>
                  <Form.Select
                    required
                    aria-label="Enter Priority"
                    name="category"
                    value={transactionRec.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Property Sale">Property Sale</option>
                    <option value="Property Purchase">
                      Property Purchase{" "}
                    </option>
                    <option value="Commission">Commission</option>
                    <option value="Salary">Salary</option>
                    <option value="Others">Others</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3" controlId="formBasicTitle">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicTitle"
                  >
                    Summary
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={transactionRec.title}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicTargetdate"
                  >
                    Transaction Date
                    {/* {new Date(transactionRec.targetdate).toISOString} */}
                  </Form.Label>

                  <Form.Control
                    required
                    type="date"
                    name="transactiondate"
                    placeholder="Enter targetdate"
                    value={ transactionRec.transactiondate ? moment(transactionRec.transactiondate).format(
                      "YYYY-MM-DD"
                    ) : ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3" controlId="formBasicStatus">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicStatus"
                  >
                    Amount
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="amount"
                    placeholder="Enter Amount"
                    value={transactionRec.amount}
                    onChange={(e)=>{
                      if(e.target.value > 0){
                        settransactionRec({ ...transactionRec, [e.target.name]: e.target.value });
                      }else{
                        settransactionRec({ ...transactionRec, [e.target.name]: 0 });

                      }
                    }}
                  />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3" controlId="formBasicStatus">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicStatus"
                  >
                    Payment Status
                  </Form.Label>
                  <Form.Select
                    required
                    aria-label="Enter status"
                    name="status"
                    value={transactionRec.status}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid </option>
                    <option value="Not Paid">Not Paid</option>
                  </Form.Select>
                </Form.Group>
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
                    value={transactionRec.description}
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
          {transactionRec?.id ? "Update" : "Save"}
        </Button>
        <Button onClick={props.onHide} variant="light">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default TransactionEdit;
