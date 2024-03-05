import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Nav, Row,Tooltip,OverlayTrigger } from "react-bootstrap";
import Confirm from "../common/Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RelatedListTask from "../task/RelatedListTask";
import inventoryApi from "../../api/inventoryApi";
import FilesCreate from "../FilesCreate";
import RelatedListFiles from "../RelatedListFiles";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TaskEdit from "../task/TaskEdit";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import moment from "moment";

const ContactView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contact, setContact] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [modalShowTask, setModalShowTask] = useState(false);
  const [relatedListTasks, setRelatedListTasks] = useState(true);
  const [relatedListFiles, setRelatedListFiles] = useState(false);
  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [files, setFiles] = useState([]);
  const [refreshFileList, setRefreshFileList] = useState();
  const [refreshTaskList, setRefreshTaskList] = useState(Date.now());
  const [isOverlayDeleteVisible, setIsDeleteOverlayVisible] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = () => {
    // Coming from Email
    if (
      !contact.id &&
      location.hasOwnProperty("pathname") &&
      location.pathname.split("/").length >= 3
    ) {
      contact.id = location.pathname.split("/")[2];
      setRefreshTaskList(Date.now());
    }

    async function initContact() {
      let result = await inventoryApi.fetchContact(contact.id);
      if (result) {
        setContact(result);
      } else {
        setContact({});
      }
    }
    initContact();
  };
  const handleDeleteMouseEnter = () => {
    setIsDeleteOverlayVisible(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteOverlayVisible(false);
  };

  const filesList = () => {
    async function init() {
      let file = await inventoryApi.fetchFiles(contact.id);
      if (file && file?.length > 0) {
        setFiles(file);
      } else {
        setFiles([]);
      }
    }
    init();
  };

  const deleteContact = async () => {
    const result = await inventoryApi.deleteContact(contact.id);
    if (result.success) navigate(`/contacts`);
  };

  const editContact = () => {
    navigate(`/contacts/${contact.id}/e`, { state: contact });
  };

  const submitTasks = () => {
    setModalShowTask(false);
    setRefreshTaskList(Date.now());
  };

  const submitfiles = () => {
    setModalShowFile(false);
    setFiles([]);
    setRefreshFileList(Date.now());
    filesList();
  };

  const handleSelect = (key) => {
    if (key === "tasks") {
      setRelatedListTasks(true);
      setRelatedListFiles(false);
    } else if (key === "files") {
      setRelatedListTasks(false);
      setRelatedListFiles(true);
    }
  };
  return (
    <div>
      <Container>
        <CustomSeparator
          cmpListName="Contacts"
          currentCmpName={contact.firstname + " " + contact.lastname}
          indexLength="2"
          url="/contacts"
        ></CustomSeparator>
      </Container>

      {contact && (
        <Container className="mt-4">
          {modalShow && (
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteLead={deleteContact}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="lead"
            />
          )}
          <Row className="view-form">
            <Col></Col>
            <Col lg={8} className="ibs-form-section">
              <Row className="view-form-header align-items-center">
                <Col lg={6}>
                  Contact
                  <h4>{contact.firstname + " " + contact.lastname}</h4>
                </Col>
                <Col lg={6} className="d-flex justify-content-end">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                >
                  <Button
                    className="btn-sm mx-2"
                    onClick={() => editContact(true)}
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
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
                    className="btn-sm"
                    variant="danger"
                    onClick={() => setModalShow(true)}
                  >
                   <i class="fa fa-trash" aria-hidden="true"></i>
                  </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <label>Name</label>
                  <span>
                    {contact.salutation} {contact.firstname} {contact.lastname}
                  </span>
                </Col>
                {/* <Col lg={6}>
                  <label>Contact Type</label>
                  <span>{contact.type}</span>
                </Col> */}
                {/* <Col lg={6}>
                  <label>Title</label>
                  <span>{contact.title}</span>
                </Col> */}

                <Col lg={6}>
                  <label>Email</label>
                  <span>{contact.email}</span>
                </Col>
                <Col lg={6}>
                  <label>Phone</label>
                  <span>{contact.phone}</span>
                </Col>
              </Row>
            </Col>
            <Col></Col>
          </Row>
          <Card bg="light" text="light" className="mb-2 mt-4">
            <Card.Header className="d-flex justify-content-between">
              <Tabs
                defaultActiveKey="tasks"
                id="uncontrolled-tab-example"
                onSelect={(key) => handleSelect(key)}
              >
                <Tab eventKey="tasks" title="Tasks"></Tab>
                <Tab eventKey="files" title="Files"></Tab>
              </Tabs>
              {relatedListTasks && (
                <Button
                  className="float-right btn-sm"
                  onClick={() => setModalShowTask(true)}
                >
                  New Task
                </Button>
              )}
              {modalShowTask && (
                <TaskEdit
                  show={modalShowTask}
                  onHide={() => setModalShowTask(false)}
                  parentid={contact.id}
                  table="contact"
                  submitTasks={submitTasks}
                />
              )}
              {relatedListFiles && (
                <Button
                  className="float-right btn-sm"
                  onClick={() => setModalShowFile(true)}
                >
                  Upload File
                </Button>
              )}
              {modalShowTaskfile && (
                <FilesCreate
                  show={modalShowTaskfile}
                  onHide={() => setModalShowFile(false)}
                  parent={contact}
                  table="contact"
                  submitfiles={submitfiles}
                />
              )}
            </Card.Header>
            <Card.Body>
              {relatedListTasks ? (
                <RelatedListTask
                  parent={contact}
                  refreshTaskList={refreshTaskList}
                />
              ) : (
                ""
              )}
              {relatedListFiles ? (
                <RelatedListFiles
                  parent={contact}
                  files={files}
                  refreshFileList={refreshFileList}
                />
              ) : (
                ""
              )}
            </Card.Body>
          </Card>
        </Container>
      )}
    </div>
  );
};

export default ContactView;
