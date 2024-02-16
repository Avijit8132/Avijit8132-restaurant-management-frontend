import React, { useState, useEffect } from "react";

import { Button, Card, Col, Container, Row, useParams } from "react-bootstrap";
import Confirm from "../common/Confirm";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RelatedListTask from "../task/RelatedListTask";
import inventoryApi from "../../api/inventoryApi";
import FilesCreate from "../FilesCreate";
import RelatedListFiles from "../RelatedListFiles";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TaskEdit from "../task/TaskEdit";
import Path from "../common/Path";
import Chat from "../common/Chat";
import EmailComposer from "../common/EmailComposer";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import PubSub from "pubsub-js";
import moment from "moment";

const OldLeadView = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [lead, setLead] = useState(location.state ? location.state : {});
  const [leadStatusArray, setleadStatusArray] = useState(
    JSON.parse(localStorage.getItem("lead_status"))
  );

  //.log("location.state",location.state);
  //.log("lead---->>>", JSON.stringify(lead));
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEmail, setModalShowEmail] = useState(false);
  const [modalShowTask, setModalShowTask] = useState(false);
  const [relatedListTasks, setRelatedListTasks] = useState(false);
  const [relatedListFiles, setRelatedListFiles] = useState(true);
  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [refreshFileList, setRefreshFileList] = useState();
  const [refreshTaskList, setRefreshTaskList] = useState(Date.now());

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = () => {
    // Coming from Email
    //.log("from url lead id: ", location);
    if (
      !lead.id &&
      location.hasOwnProperty("pathname") &&
      location.pathname.split("/").length >= 3
    ) {
      lead.id = location.pathname.split("/")[2];
      setRefreshFileList(Date.now());
      setRefreshTaskList(Date.now());
    }

    //.log("lead id - ", lead.id);
    async function initLead() {
      let result = await inventoryApi.fetchLead(lead.id);
      //.log("result==123=>:", result);
      if (result) {
        setLead(result);
      } else {
        // setLead({});
      }
    }
    // initLead();
  };

  const deleteLead = async () => {
    const result = await inventoryApi.deleteOldLead(lead.id);
    if (result.success){
        PubSub.publish("RECORD_ERROR_TOAST", {
            title: "Delete",
            message: result.message,
          });
        navigate(`/importdata`);
    } 
  };

  const editLead = () => {
    navigate(`/leads/${lead.id}/e`, { state: lead });
  };

  const submit = () => {
    setModalShowTask(false);
    navigate(`/leads/${lead.id}`, { state: lead });
  };

  const submitTasks = () => {
    setModalShowTask(false);
    setModalShowEmail(false);

    setRefreshTaskList(Date.now());
  };
  const submitfiles = () => {
    setModalShowFile(false);

    setRefreshFileList(Date.now());
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
          cmpListName="All Imported Leads"
          currentCmpName={lead.clientname}
          indexLength="2"
          url="/importdata"
        ></CustomSeparator>
      </Container>

      {lead && (
        <Container className="mt-4">
          {modalShow && (
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteLead={deleteLead}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="lead"
            />
          )}
          <Row className="view-form gx-5 mx-auto">
            <Col lg={10}>
              <Row className="view-form-header align-items-center">
                <Col lg={3}>
                  Lead
                  <h4>{lead.clientname}</h4>
                </Col>
                <Col lg={9} className="d-flex justify-content-end">
                  {/* <Button
                    className="btn-sm mx-2"
                    onClick={() => editLead(true)}
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </Button>
                  <Button
                    className="float-right btn-sm mx-2"
                    onClick={() => setModalShowEmail(true)}
                    variant="success"
                  >
                    <i class="fa-regular fa-envelope mx-2"></i>
                    Send Email
                  </Button> */}
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={() => setModalShow(true)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
              <Row
                className="py-3 ibs-edit-form"
                style={{ backgroundColor: "#fff" }}
              > 
                <Col lg={6}>
                  <label>Name</label>
                  <span>
                    {lead.clientname}
                  </span>
                </Col>
                <Col lg={6}>
                  <label>Actions</label>
                  <span>{lead.actions}</span>
                </Col>
                <Col lg={6}>
                  <label>Status</label>
                  <span>{lead.leadstatus}</span>
                </Col>
                <Col lg={6}>
                  <label>Stage Status</label>
                  <span>{lead.leadstagestatus}</span>
                </Col>
                <Col lg={6}>
                  <label>Lead Id</label>
                  <span>{lead.leadid}</span>
                </Col>
                <Col lg={6}>
                  <label>Lead Created Date</label>
                  <span>{moment(lead.leadcreateddate ).format("DD-MM-YYYY")}</span>
                </Col>
                {/* <Col lg={6}>
                  <label>Intrested Property</label>
                  <span>
                    <Link to={`/properties/${lead.propertyid}`}>
                      {lead.propertyname}
                    </Link>
                  </span>
                </Col> */}
                <Col lg={6}>
                  <label>Area</label>
                  <span>{lead.area}</span>
                </Col>
                <Col lg={6}>
                  <label>Lead Ageing</label>
                  <span>{lead.leadageing}</span>
                </Col>
                <Col lg={6}>
                  <label>Vertical Types</label>
                  <span>{lead.verticaltypes}</span>
                </Col>
                <Col lg={6}>
                  <label>Vertical Location</label>
                  <span>{lead.verticallocation}</span>
                </Col>
                <Col lg={6}>
                  <label>Requirement Zone</label>
                  <span>{lead.requirementzone}</span>
                </Col>
                <Col lg={6}>
                  <label>Remarks</label>
                  <span>{lead.remarks}</span>
                </Col>
                {/* <Col lg={6}>
                  <label>City</label>
                  <span>{lead.city}</span>
                </Col>
                <Col lg={6}>
                  <label>State</label>
                  <span>{lead.state}</span>
                </Col>
                <Col lg={6}>
                  <label>Pincode</label>
                  <span>{lead.pincode}</span>
                </Col>
                <Col lg={6}>
                  <label>Country</label>
                  <span>{lead.country}</span>
                </Col> */}
                {/* <Col lg={6}>
                  <label>Assigned Staff</label>
                  <span>
                    <Link to={`/users/${lead.ownerid}`}>{lead.ownername}</Link>
                  </span>
                </Col> */}
                <Col lg={6}>
                  <label>Created By</label>
                  <span>{lead.createdbyname}</span>
                </Col>
              </Row>
            </Col>
            <Col lg={2}>
              {/* <Chat parentid={lead.id} /> */}
            </Col>
          </Row>
          <Card bg="light" text="light" className="mb-2 mt-4">
            <Card.Header className="d-flex justify-content-between">
              <Tabs
                defaultActiveKey="files"
                id="uncontrolled-tab-example"
                onSelect={(key) => handleSelect(key)}
              >
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
                  parentid={lead.id}
                  table="lead"
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
                  parent={lead}
                  table="contact"
                  submitfiles={submitfiles}
                />
              )}
            </Card.Header>
            <Card.Body>
              {relatedListTasks ? (
                <RelatedListTask
                  parent={lead}
                  refreshTaskList={refreshTaskList}
                />
              ) : (
                ""
              )}
              {relatedListFiles ? (
                <RelatedListFiles
                  parent={lead}
                  refreshFileList={refreshFileList}
                />
              ) : (
                ""
              )}
            </Card.Body>
          </Card>
          <EmailComposer
            size="lg"
            show={modalShowEmail}
            onHide={() => setModalShowEmail(false)}
            parentid={lead?.id}
            toEmail={lead?.email}
            table="lead"
            submitTasks={submitTasks}
          />
        </Container>
      )}
    </div>
  );
};

export default OldLeadView;
