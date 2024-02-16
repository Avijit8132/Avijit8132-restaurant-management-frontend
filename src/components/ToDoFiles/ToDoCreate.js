import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import inventoryApi from "../../api/inventoryApi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Todo } from "./Todo";
import { ToDoEditText } from "./ToDoEditText";
import { v1 } from "uuid";
import ListGroup from "react-bootstrap/ListGroup";
import { useFormik, Field, Formik } from "formik";

function ToDoCreate() {
  //   let dispatch = useDispatch();
  const navigate = useNavigate();
  const [value2, setValue2] = useState("");
  const [Titlevalue, setTitlevalue] = useState("");
  const [Descriptionvalue, setDescriptionvalue] = useState("");
  const [Priorityvalue, setPriorityvalue] = useState("");
  const [todoDetails, setTodoDetails] = useState([]);
  const [todos, setTodos] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(todoDetails);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodoDetails(items);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (value2) {
      ////.log("Task value", value2);
      setTodoDetails((prev) => [
        ...prev,
        {
          id: v1(),
          name: value2,
          checked: false,
          priority: Priorityvalue,
          description: Descriptionvalue,
        },
      ]);
      setValue2("");
      setPriorityvalue("");
      setDescriptionvalue("");
    }
  };

  const deleteTodo = (id) => {
    ////.log("deleteTodo 1",todoDetails)
    ////.log("deleteTodo 2",name)
    const data = todoDetails.filter((todo) => todo.id !== id);
    setTodoDetails(data);
    ////.log("deleteTodo 3",todoDetails)
  };

  const toggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (id) => {
    //.log("editTodo", id);
    setTodoDetails((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) return { ...todo, isEditing: !todo.isEditing };
        return todo;
      })
    );
  };

  const editTask = (task, id) => {
    setTodoDetails((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, task, isEditing: false } : todo
      )
    );
  };

  const onSubmitSave = async (e) => {
  
    let newTodo = {
      name: Titlevalue,
      details: todoDetails,
    };

    //.log("newTodo", newTodo);

    const result = await inventoryApi.createToDO(newTodo);
    //.log("result submit: ", result);
    if (result) {
      navigate(`/TodoView/${result.id}`, { state: result });
    }
  };

  return (
    <Container className="view-form">
      <Row>
        <Col></Col>
        <Col lg={10} style={{ backgroundColor: "white", margin: "40px" }}>
          <Formik
          //validationSchema={schemaContactEdit()}
          //onSubmit={handleSubmitSave}
          //initialValues={contactEditInitialValues(contact)}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form
                className="mt-3"
                onSubmit={handleSubmit2}
                noValidate
                //validated={validated}
              >
                <Row
                  lg={12}
                  className="view-form-header align-items-center"
                  style={{ marginTop: "-10px" }}
                >
                  <Col lg={8}>
                    <h6>Create To Do</h6>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    {Titlevalue && todoDetails.length > 0 && (
                      <Button
                        type="submit"
                        className="btn-sm"
                        onClick={onSubmitSave}
                      >
                        Save
                      </Button>
                    )}
                    &nbsp;&nbsp;
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={() => navigate("/Todo")}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>

                <Row className="align-items inputbox">
                  <Col lg={4}>
                    <label>
                      Title <b style={{ color: "red" }}>*</b>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      value={Titlevalue}
                      onChange={(e) => setTitlevalue(e.target.value)}
                      placeholder="What is the Title?"
                    />
                  </Col>
                </Row>

                <Row className="align-items inputbox">
                  <Col lg={4}>
                    <label>
                      Task <b style={{ color: "red" }}>*</b>
                    </label>
                    <Field
                      name="task"
                      placeholder="What is the task today?"
                      type="text"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                    />
                  </Col>
                  <Col lg={4}>
                    <label>Priority</label>
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
                    <label>Description</label>
                    <Field
                    className=" textarea w-80"
                      name="description"
                      as="textarea"
                      value={Descriptionvalue}
                      onChange={(e) => setDescriptionvalue(e.target.value)}
                      placeholder="Enter your description"
                    />
                  </Col>
                </Row>

                <br></br>
                <Button type="submit" className="mx-3">
                  Add Task
                </Button>

                <br></br>
                <br></br>
                <div className="dragable mb-4 mx-3" >
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="drag-drop-list">
                      {(provided) => (
                        <ListGroup
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="drag-drop-list-container w-70"
                        >
                          {todoDetails.map((todo, index) => (
                            <Draggable
                              key={todo.name}
                              draggableId={todo.name}
                              index={index}
                            >
                              {(provided) => (
                                <ListGroup.Item
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {todo.isEditing ? (
                                    <ToDoEditText
                                      editTask={editTask}
                                      task={todo}
                                    />
                                  ) : (
                                    <Todo
                                      task={todo}
                                      deleteTodo={() => deleteTodo(todo.id)}
                                      handleEditTodo={(value, id) => {
                                        editTodo(todo.id);
                                      }}
                                    />
                                  )}
                                </ListGroup.Item>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ListGroup>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default ToDoCreate;
