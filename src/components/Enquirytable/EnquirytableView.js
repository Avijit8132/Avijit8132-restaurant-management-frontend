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
import PubSub from "pubsub-js";

const EnquiryView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [Enquiry, setEnquiry] = useState(location.state ? location.state : {});
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
    fetchEnquiry();
  }, []);

  const fetchEnquiry = () => {
    // Coming from Email
    if (
      !Enquiry.id &&
      location.hasOwnProperty("pathname") &&
      location.pathname.split("/").length >= 3
    ) {
      Enquiry.id = location.pathname.split("/")[2];
      setRefreshTaskList(Date.now());
    }

    async function initEnquiry() {
      //.log("data-->",Enquiry,Enquiry.id)
      let result = await inventoryApi.fetchEnquiry(Enquiry.id);
      if (result) {
        setEnquiry(result);
      } else {
        setEnquiry({});
      }
    }
    initEnquiry();
  };

  const handleDeleteMouseEnter = () => {
    setIsDeleteOverlayVisible(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteOverlayVisible(false);
  };

  const filesList = () => {
    async function init() {
      let file = await inventoryApi.fetchFiles(Enquiry.id);
      if (file && file?.length > 0) {
        setFiles(file);
      } else {
        setFiles([]);
      }
    }
    init();
  };

  const deleteEnquiry = async () => {
    const result = await inventoryApi.deleteEnquiry(Enquiry.id);
    if (result.success) 
    navigate(`/enquiry`);
  };

  const cancelEnquiry = () => {
    navigate(`/enquiry`);
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

  const ConvertToLead = async () => {
    //.log("check-->", Enquiry, Enquiry.id, Enquiry.name);
    let result = await inventoryApi.createconvertLead(Enquiry);
    //.log("result-->",result)
      if (result) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: result.message,
        });
        //.log('result.siteid',result.message)
        navigate(`/leads/${result.data.id}`, { state: result });
      }
  };

  return (
    <div>
      <Container>
        <CustomSeparator
          cmpListName="enquiry"
          currentCmpName={Enquiry.name}
          indexLength="2"
          url="/enquiry"
        ></CustomSeparator>
      </Container>

      {Enquiry && (
        <Container className="mt-4">
          {modalShow && (
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteLead={deleteEnquiry}
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
                  Enquiry
                  <h4>{Enquiry.firstname + "" + Enquiry.lastname}</h4>
                </Col>
                <Col lg={6} className="d-flex justify-content-end">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">Convert to Lead</Tooltip>}
                >
                <Button
                    className="btn-sm mx-2"
                    onClick={() => ConvertToLead(true)}
                  >
                    Convert 
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

                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                >
                  <Button
                    className="btn-sm mx-2"
                    onClick={() => cancelEnquiry(true)}
                  >
                   Cancel
                  </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row>
              {/* {//.log("Enquiry==>",Enquiry)} */}

                <Col lg={6}>
                  <label>Name</label>
                  <span>
                  <h4>{Enquiry.firstname + "" + Enquiry.lastname}</h4>
                  </span>
                </Col>
                <Col lg={6}>
                  <label>Phone</label>
                  <span>{Enquiry.phone}</span>
                </Col>
                <Col lg={6}>
                  <label>Email</label>
                  <span>{Enquiry.email}</span>
                </Col>

                <Col lg={6}>
                  <label>Description</label>
                  <span>{Enquiry.description}</span>
                </Col>
                <Col lg={6}>
                  <label>Transaction type</label>
                  <span>{Enquiry.transactiontype}</span>
                </Col>
                <Col lg={6}>
                  <label>verticals</label>
                  <span>{Enquiry.verticals}</span>
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
                  parentid={Enquiry.id}
                  table="Enquiry"
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
                  parent={Enquiry}
                  table="contact"
                  submitfiles={submitfiles}
                />
              )}
            </Card.Header>
            <Card.Body>
              {relatedListTasks ? (
                <RelatedListTask
                  parent={Enquiry}
                  refreshTaskList={refreshTaskList}
                />
              ) : (
                ""
              )}
              {relatedListFiles ? (
                <RelatedListFiles
                  parent={Enquiry}
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

export default EnquiryView;
