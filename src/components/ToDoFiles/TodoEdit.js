import React, { useState } from "react";
import { Badge, Button, Col, Container, Form, Row,Tooltip,OverlayTrigger } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import inventoryApi from "../../api/inventoryApi";
import { v1 } from "uuid";
import { useFormik, Field, Formik, ErrorMessage } from "formik";

export const TodoEdit = () => {
  const navigate = useNavigate();
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [Priorityvalue, setPriorityvalue] = useState("");
  const [Descriptionvalue, setDescriptionvalue] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const [Id, setId] = useState();
  const [todoDetails, setTodoDetails] = useState([]);
  //   let dispatch = useDispatch();
  const location = useLocation();
  const todoDetail = location.state;

  const VerticalColors = {
    Low: "#F2E962",
    Normal: "#89DA3D",
    Medium: "#3DDAC7",
    High: "#F04941",
  };

  useEffect(() => {
    if (todoDetail && Object.keys(todoDetail).length > 0) {
      ////.log("id save-->", todoDetail.id);
      setTodoDetails(todoDetail.details);
      setValue1(todoDetail.name);
      setId(todoDetail.id);
    }
  }, [todoDetail]);

  //.log("data-->", todoDetail);
  ////.log("id-->",Id);
  ////.log("id-->", todoDetail.id);

  const addValues = () => {
    if (value3) {
      //.log("Task value add");
      setTodoDetails((prev) => [
        ...prev,
        {
          id: v1(),
          name: value3,
          checked: false,
          priority: Priorityvalue,
          description: Descriptionvalue,
        },
      ]);

      setValue3("");
      setPriorityvalue("");
      setDescriptionvalue("");
    }
  };

  //.log("Todos after click", todoDetails);

  const handleSubmitSave = async (e) => {
    
    e.preventDefault();
    //.log("value1", value1);
    //.log("submit inside todoDetails ", todoDetails);
    //.log("Id inside todoDetails ", Id);
    let data = {
      id: Id,
      name: value1,
      details: todoDetails,
    };
    //.log("newTodo final", data);

    const result = await inventoryApi.saveTodo(data);
    //.log("result submit  ", result);
    if (result) {
      navigate(`/TodoView/${result.id}`, { state: result });
    }
  };

  const handleCancel = (todoDetail) => {
    navigate(`/Todo`);
  };

  return (
    <Container className="view-form">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Formik onSubmit={handleSubmitSave}>
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form onSubmit={handleSubmit} className="mx-2 ibs-form-section">
                <Row className="view-form-header align-items-center mx-1">
                  <Col lg={6}>
                    <h3>Edit Todo</h3>
                    <h6>{todoDetail.name}</h6>
                  </Col>
                  <Col className="d-flex justify-content-end">
                  {value1 &&<Button
                      type="submit"
                      className="btn-sm"
                      onClick={handleSubmitSave}
                    >
                      Save
                    </Button>}
                    &nbsp; &nbsp;
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>

                <Row className="align-items inputbox mx-3">
                  <Col lg={4}>
                    <label>
                      Title <b style={{ color: "red" }}>*</b>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                      placeholder="What is the Title?"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="error-message"
                    />
                  </Col>
                </Row>

                {!value1 && (
                    <Row className="mx-3 mt-2">
                      <h6 component="div" className=" error-message">Title is required</h6>
                    </Row>
                  )}

                <Row className="align-items inputbox mx-3">
                  <Col lg={4}>
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Task <b style={{ color: "red" }}>*</b>
                    </Form.Label>
                    <Field
                      placeholder="Add more tasks here?"
                      type="text"
                      value={value3}
                      onChange={(e) => setValue3(e.target.value)}
                      className="todo-input2"
                    />
                  </Col>
                  <Col lg={4}>
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Priority
                    </Form.Label>
                    <Field
                      as="select"
                      name="priority"
                      value={Priorityvalue}
                      onChange={(e) => setPriorityvalue(e.target.value)}
                    >
                      <option value="">--Select Priority--</option>
                      <option value="Low">Low </option>
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Field>
                  </Col>
                  <Col lg={4}>
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Desciption
                    </Form.Label>
                    <Field
                      className="textarea w-100"
                      as="textarea"
                      value={Descriptionvalue}
                      onChange={(e) => setDescriptionvalue(e.target.value)}
                      placeholder="Enter your description"
                    />
                  </Col>
                </Row>

                <br></br>
                <Button
                  className="mx-4"
                  onClick={(e) => {
                    e.preventDefault();
                    addValues(e);
                    setErrorMessage(false);
                  }}
                >
                  Add Task
                </Button>
                <br></br>
                <br></br>
                <Col lg={6} className="ibs-todo-form-section"></Col>


                <Col className="ibs-todo-form-section">
                  <Form.Group controlId="formBasicTitle">
                    <h5 className="mx-3">Details</h5>
                    {todoDetails &&
                      todoDetails.map((detail, index) => (
                        <ListGroup>
                          <ListGroup.Item key={index} className="m-3">
                            <Row lg={12}>
                              <Col>
                                <Row>
                                  <Col lg={8} className="d-flex ">
                                    <Form.Control
                                      className="w-75"
                                      type="text"
                                      name="Name"
                                      value={detail.name || ""}
                                      onChange={(e) => {
                                        const updatedDetails = [...todoDetails];
                                        updatedDetails[index].name =
                                          e.target.value;
                                        setTodoDetails(updatedDetails);
                                      }}
                                    />
                                    &nbsp; &nbsp;
                                    <Form.Select
                                      className="w-20"
                                      as="select"
                                      name="priority"
                                      value={detail.priority || ""}
                                      onChange={(e) => {
                                        const updatedDetails = [...todoDetails];
                                        updatedDetails[index].priority =
                                          e.target.value;
                                        setTodoDetails(updatedDetails);
                                      }}
                                    >
                                      <option value="">
                                        --Select Priority--
                                      </option>
                                      <option value="Low">Low </option>
                                      <option value="Normal">Normal</option>
                                      <option value="Medium">Medium</option>
                                      <option value="High">High</option>
                                    </Form.Select>
                                  </Col>
                                </Row>
                                <Row className="mt-2">
                                  <Col lg={11}>
                                    <Form.Control
                                      className="w-70"
                                      type="text"
                                      as="textarea"
                                      name="Description"
                                      value={detail.description || ""}
                                      onChange={(e) => {
                                        const updatedDetails = [...todoDetails];
                                        updatedDetails[index].description =
                                          e.target.value;
                                        setTodoDetails(updatedDetails);
                                      }}
                                    />
                                    {errorMessage && (
                                      <div
                                        style={{ color: "red" }}
                                        className="error"
                                      >
                                        {" "}
                                        {errorMessage}{" "}
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2} className="d-flex">
                                <Form.Check
                                  style={{ fontSize: "28px" }}
                                  key={index}
                                  name="Checkbox"
                                  title="Checkbox"
                                  type="checkbox"
                                  checked={detail.checked}
                                  onChange={() => {
                                    const updatedDetails = [...todoDetails];
                                    updatedDetails[index].checked =
                                      !detail.checked;
                                    setTodoDetails(updatedDetails);
                                  }}
                                />
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip className="my-tooltip">Delete</Tooltip>}
                                  >
                                <Button
                                  style={{
                                    height: "30px",
                                    width: "30px",
                                  }}
                                  className="btn-sm mx-2 mt-2"
                                  variant="danger"
                                  // title="Delete"
                                  onClick={() => {
                                    const updatedDetails = [...todoDetails];
                                    if (updatedDetails.length > 1) {
                                      const data = updatedDetails.filter(
                                        (x) => {
                                          return x !== updatedDetails[index];
                                        }
                                      );
                                      //.log("map1", data);
                                      setTodoDetails(data);
                                    } else {
                                      setErrorMessage(
                                        "Atleast one task should be there !"
                                      );
                                    }
                                  }}
                                >
                                  <i class="fa fa-trash"></i>
                                </Button>
                                </OverlayTrigger>
                              </Col>
                            </Row>

                            <br />
                          </ListGroup.Item>
                        </ListGroup>
                      ))}
                  </Form.Group>
                </Col>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};
export default TodoEdit;
