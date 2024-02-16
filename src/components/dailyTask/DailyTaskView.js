import React, { useState, useEffect } from "react";
import { Button,Card, Col,Container, Row,Tabs,Tab,Tooltip,OverlayTrigger} from "react-bootstrap";
import Confirm from "../common/Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import moment from "moment/moment";
import jwt_decode from "jwt-decode";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import TaskHistoryList from "../task/TaskHistoryList";

const DailyTaskView = (props) => {
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const [dailyTask, setDailyTask] = useState(location.state ? location.state : {});
  const [isOverlayDeleteVisible, setIsDeleteOverlayVisible] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        let user = jwt_decode(localStorage.getItem("token"));
        setUserInfo(user);
      }
    } catch (error) {
      //.log(error);
    }
    fetchDailyTask();
  }, []);

  const fetchDailyTask = () => {
    if (
      !dailyTask.id &&
      location.hasOwnProperty("pathname") &&
      location.pathname.split("/").length >= 3
    ) {
        dailyTask.id = location.pathname.split("/")[2];
    }
    async function initDailyTask() {
      let result = await inventoryApi.fetchDailyTaskById(dailyTask.id);
      //.log("result==123=>:", result);
      if (result) {
       setDailyTask(result[0]);
      } else {
        setDailyTask({});
      }
    }
    initDailyTask();
  };

  const deleteDailyTask = async () => {
    const result = await inventoryApi.deleteDailyTask(dailyTask.id);
    if (result.success) navigate(`/dailytasklist`);
  };

  const editLead = () => {
    navigate(`/dailytasklist/${dailyTask.id}/e`, { state: dailyTask });
  };
  const handleDeleteMouseEnter = () => {
    setIsDeleteOverlayVisible(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteOverlayVisible(false);
  };

  return (
    <div>
      <Container>
        <CustomSeparator
          cmpListName="Daily Task"
          currentCmpName={dailyTask.title}
          indexLength="2"
          url="/dailytasklist"
        ></CustomSeparator>
      </Container>

      {dailyTask && (
        <Container className="mt-4">
          {modalShow && (
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteDailyTask={deleteDailyTask}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="dailyTask"
            />
          )}
          <Row className="view-form m-4">
            <Col lg={12} className="ibs-form-section">
              <Row className="view-form-header align-items-center ">
                <Col lg={6}>
                  Daily Task
                  <h4>{dailyTask.title}</h4>
                </Col>
                <Col lg={6} className="d-flex justify-content-end">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                  >
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editLead(true)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                  </OverlayTrigger>
                  {userInfo.userrole === "SUPER_ADMIN" ? (
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
                        <i class="fa fa-trash"></i>
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <Row className="view-form-content">
                {" "}
                <Col lg={6}>
                  <label>Title</label>
                  <span>{dailyTask.title || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Priority</label>
                  <span>{dailyTask.priority || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Status</label>
                  <span>{dailyTask.status || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Target Date</label>

                  <span>
                    {dailyTask.targetdate
                      ? moment(dailyTask.targetdate || <br />).format(
                          "DD-MM-YYYY"
                        )
                      : ""}
                  </span>
                </Col>
                <Col lg={6}>
                  <label> Emails Received</label>
                  <span>{dailyTask.emailsreceived || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Emails Replied Except Proposal Send</label>
                  <span>
                    {dailyTask.emailsrepliedexceptproposalsend || <br />}
                  </span>
                </Col>
                <Col lg={6}>
                  <label> Under Construction Properties</label>
                  <span>{dailyTask.underconstructionproperties || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Follow Up Taken</label>
                  <span>{dailyTask.followuptaken || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Completion Of Construction</label>
                  <span>{dailyTask.completionofconstruction || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Seller Lead Generated</label>
                  <span>{dailyTask.sellerleadgenerated || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Seller Lead Confirmed</label>
                  <span>{dailyTask.sellerleadconfirmed || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Follow Up Taken From Potential Sellers</label>
                  <span>
                    {dailyTask.followuptakenfrompotentialsellers || <br />}
                  </span>
                </Col>
                <Col lg={6}>
                  <label> PPT</label>
                  <span>{dailyTask.ppt || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Proposal Send</label>
                  <span>{dailyTask.proposalsend || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Online Platform Update</label>
                  <span>{dailyTask.onlineplatformupdate || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Client Data Based Updated</label>
                  <span>{dailyTask.clientdatabasedupdated || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> CRM Update </label>
                  <span>{dailyTask.crmupdate || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Otherwork 1</label>
                  <span>{dailyTask.otherwork1 || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Otherwork 2</label>
                  <span>{dailyTask.otherwork2 || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Otherwork 3</label>
                  <span>{dailyTask.otherwork3 || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Otherwork 4</label>
                  <span>{dailyTask.otherwork4 || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label> Assigned Staff</label>
                  <span>{dailyTask.ownername || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Details</label>
                  <span>{dailyTask.details || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Description</label>
                  <span>{dailyTask.description || <br />}</span>
                </Col>
                <Col lg={6}>
                  <label>Created By</label>
                  <span>{dailyTask.createdbyname}</span>
                </Col>
                <Col lg={6}>
                  <label>Created date </label>
                  <span>
                    {moment(dailyTask.createddate).format("DD-MM-YYYY hh:mm A")}
                  </span>
                </Col>
                <Col lg={6}>
                  <label>Last modifieddate</label>
                  <span>
                    {moment(dailyTask.lastmodifieddate).format(
                      "DD-MM-YYYY hh:mm A"
                    )}
                  </span>
                </Col>
                <Col lg={6}>
                  <label>lastmodifieddateby</label>
                  <span>{dailyTask.lastmodifiedbyname}</span>
                </Col>
              </Row>
            </Col>
          </Row>

          <Card bg="light" text="light" className="mb-2 mt-4">
            <Card.Header className="d-flex justify-content-between">
              <Tabs defaultActiveKey="tasks" id="uncontrolled-tab-example">
                <Tab eventKey="tasks" title="Task History"></Tab>
              </Tabs>
            </Card.Header>
            <Card.Body>
              {dailyTask && dailyTask.id}

              <TaskHistoryList
                // refreshTaskList={refreshTaskList}
                parent={dailyTask}
              />
            </Card.Body>
          </Card>
        </Container>
      )}
    </div>
  );
};

export default DailyTaskView;