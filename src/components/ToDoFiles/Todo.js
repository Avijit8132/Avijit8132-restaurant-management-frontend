import React, { useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Todo = ({
  task,
  deleteTodo,
  handleEditTodo,
  checkedTodofunction,
}) => {
  const [Checkvalue, setCheckvalue] = useState(false);
  //.log("task", task);
  const toggleComplete = (e) => {
    setCheckvalue(e);
    task.checked = e;
  };

  const VerticalColors = {
    Low: "#F2E962",
    Normal: "#89DA3D",
    Medium: "#3DDAC7",
    High: "#F04941",
  };

  return (
    <Container className="view-form">
      <Col lg={12}>
        <Form>
          <Row lg={8}>
          <Col lg={1}>
          <Form.Check
                type="checkbox"
                readOnly={true}
                checked={task.checked}
                onChange={(e) => toggleComplete(e.target.checked)}
                style={{ fontSize: "25px" }}
              />
          </Col>
            <Col>
              <Row>
                <Col lg={10} className="d-flex ">
                  <h4
                    style={{
                      display: "inline",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    {task.name}
                  </h4>
                  {task.priority && (
                    <Badge
                      className="mx-2"
                      bg={VerticalColors[task.priority]}
                      style={{
                        display: "block",
                        borderRadius: "10px",
                        //padding: "5px 5px",
                        background: VerticalColors[task.priority],
                        color: "black",
                        //fontWeight: "bold",
                        fontSize: "0.9rem",
                        width: "60px",
                        paddingTop: "6px",
                      }}
                    >
                      {task.priority}
                    </Badge>
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <p>{task.description}</p>
                </Col>
              </Row>
            </Col>
            <Col lg={2} className="d-flex">
              <Button
                style={{ height: "30px", width: "30px" }}
                className="btn-sm mt-2 mx-2"
                variant="danger"
                onClick={() => deleteTodo(task.id)}
              >
                <i class="fa fa-trash"></i>
              </Button>
              <Button
                style={{ height: "30px", width: "30px" }}
                className="btn-sm mt-2 mx-2"
                onClick={() => handleEditTodo(task.id)}
              >
                <i class="fas fa-edit"></i>
              </Button>
              &nbsp;&nbsp;
             
            </Col>
          </Row>
        </Form>
      </Col>
    </Container>
  );
};
