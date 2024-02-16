import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export const ToDoEditText = ({ editTask, task }) => {
  const [value, setValue] = useState(task.name);
  const [Priority, setPriority] = useState(task.priority);
  const [Description, setDescription] = useState(task.description);

  const handleSubmit = () => {
    //.log("Task value", value);
    //.log("Task value", Priority);
    //.log("Task value", Description);
    //.log("Task id", task);
    task.name = value;
    task.priority = Priority;
    task.description = Description;
    editTask(task, task.id);
  };
  return (
    <Container className="view-form">
      <Row className="align-items-center flex-d">
        <Col lg={12}>
          <Form>
            <Row lg={8}>
              <Col>
                <Row>
                  <Col lg={10} className="d-flex ">
                    <Form.Control
                    className="w-100"
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Update task"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <Form.Select
                    className="w-40"
                    as="select"
                    name="priority"
                    value={Priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="">--Select Priority--</option>
                    <option value="Low">Low </option>
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>

                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={10}>
                  <Form.Control
                    type="text"
                    as="textarea"
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Update description"
                  />
                  </Col>
                </Row>
              </Col>
              <Col lg={2}>
                <Button onClick={handleSubmit} className="btn-sm m-3 mt-4">
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
