import React, { useState } from "react";
import { Badge, Button, Col, Container, Form, Row,Tooltip,OverlayTrigger } from "react-bootstrap";
import Confirm from "../common/Confirm";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import { View } from "@react-pdf/renderer";
import "./todo.css";

function ToDoView() {
  const navigate = useNavigate();
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [reports, setTodo] = React.useState([]);
  const [ids, setid] = useState();
  const [todoDetails, setTodoDetails] = useState([]);
  //   let dispatch = useDispatch();
  const location = useLocation();
  const todoDetail = location.state;
  ////.log("Inside todoDetail", todoDetail);
  const [isOverlayDeleteVisible, setIsDeleteOverlayVisible] = useState(false);

  const VerticalColors = {
    Low: "#F2E962",
    Normal: "#89DA3D",
    Medium: "#3DDAC7",
    High: "#F04941",
  };

  useEffect(() => {
    if (todoDetail && Object.keys(todoDetail).length > 0) {
      ////.log("check name ", todoDetail.name);
      setValue1(todoDetail.name);
      setid(todoDetail.id);
    }
  }, [todoDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //.log("value1", value1);
    //.log("value2", value2);
    if (value2) {
      //.log("Task value", value2);
      setTodoDetails((prev) => [...prev, { name: value2, checked: true }]);
      //.log("Todos:", todoDetails);
    }

    let data = {
      id: ids,
      name: value1,
      details: todoDetails,
    };
    //.log("newTodo", data);

    const result = await inventoryApi.saveTodo(data);
    if (result) {
      //.log("result submit 2: ", result);
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: "Record saved successfully",
      });
    }
  };
  const handleDeleteMouseEnter = () => {
    setIsDeleteOverlayVisible(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteOverlayVisible(false);
  };

  const handleCancel = () => {
    navigate("/Todo");
  };

  const handleEdit = () => {
    navigate("/Todoedit/" + todoDetail.id + "/e", { state: todoDetail });
  };

  const handleDelete = (detail) => {
    setModalShow(true);
    setTodo(detail);
  };

  const deleteTodo = async () => {
    //.log("deleteTodo", location.state.id);

    const result = await inventoryApi.deleteDetailTodo(location.state.id);
    //.log("result", result);
    if (result) {
      setTodo("");
      navigate("/Todo");
      setModalShow(false);
    }
  };

  return (
    <>
      {modalShow && (
        <Confirm
          show={modalShow}
          onHide={() => setModalShow(false)}
          deleteTodo={deleteTodo}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="todo"
        />
      )}
      <Container className="view-form">
        <Row className="justify-content-center">
          <Col lg={8} className="ibs-form-section">
            <Form onSubmit={handleSubmit} className="ibs-form-section">
              <Row className="view-form-header align-items-center">
                <Col lg={6}>
                  To-Do
                  <h4>{value1}</h4>
                </Col>   
                <Col className="d-flex justify-content-end">
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                  >
                  <Button className="btn-sm" onClick={handleEdit}>
                    <i class="fa fa-pen-to-square"></i>
                  </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    show={isOverlayDeleteVisible}
                    overlay={<Tooltip className="my-tooltip">Delete</Tooltip>}
                  >
                  <Button
                  onMouseEnter={handleDeleteMouseEnter}
                  onMouseLeave={handleDeleteMouseLeave}
                    className="btn-sm mx-2"
                    variant="danger"
                    onClick={(detail) => handleDelete(detail)}
                  >
                    <i class="fa fa-trash"></i>
                  </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Save</Tooltip>}
                  >
                  <Button type="submit" className="btn-sm">
                    <i style={{ fontSize: "16px" }} class="fas fa-save"></i>
                  </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Cancel</Tooltip>}
                  >
                  <Button
                    title="Cancel"
                    className="btn-sm mx-2"
                    variant="danger"
                    onClick={handleCancel}
                  >
                    <i
                      style={{ fontSize: "16px" }}
                      class="fa fa-times"
                      aria-hidden="true"
                    ></i>
                  </Button>
                  </OverlayTrigger>
                </Col>
              </Row>

              <Row>
                <Col className="col px-md-2 m-4">
                  <ListGroup>
                    {Array.isArray(location.state?.details) &&
                      location.state.details.map((detail, index) => (
                        <ListGroup.Item key={index} lg={3}>
                          <Row
                            className={`${
                              detail.checked === true ? "checked" : "un-checked"
                            }`}
                          >
                            <Col lg={1} className="d-inline">
                              <Form.Check
                                style={{ fontSize: "15px" }}
                                key={index}
                                name="Checkbox"
                                type="checkbox"
                                checked={detail.checked}
                                onChange={() => {
                                  const updatedDetails = [
                                    ...location.state.details,
                                  ];
                                  updatedDetails[index].checked =
                                    !detail.checked;
                                  setTodoDetails(updatedDetails);
                                }}
                              />
                            </Col>

                            <Col lg={11}>
                              <Row>
                                <Col className="mt-1">
                                  <h5
                                    style={{
                                      display: "inline",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textTransform: "capitalize",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {detail.name}
                                  </h5>
                                </Col>
                              </Row>
                              <Row lg={12} className="my-3 gap-1">
                                <Col
                                  lg={2}
                                  className="align-self-center"
                                  style={{
                                    borderRight: "2px solid rgb(194 194 194)",
                                  }}
                                >
                                  {detail.priority && (
                                    <Row lg={3}>
                                      <Col lg={2}>
                                        <div
                                          class="square my-1 mr-1"
                                          style={{
                                            background:
                                              VerticalColors[detail.priority],
                                          }}
                                        ></div>
                                      </Col>

                                      <Col lg={1}>
                                        <h5
                                          className="m-1"
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                          }}
                                        >
                                          {detail.priority}
                                        </h5>
                                      </Col>
                                    </Row>
                                  )}
                                </Col>

                                {/* <Col lg={1}>
                                  <div class="vr vr-blurry" style={{height: "20px"}}></div>
                                </Col> */}

                                <Col
                                  className="left-side align-self-center"
                                  lg={8}
                                >
                                  <h5 style={{ fontSize: "1.1rem" }}>
                                    {detail.description}
                                  </h5>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ToDoView;
