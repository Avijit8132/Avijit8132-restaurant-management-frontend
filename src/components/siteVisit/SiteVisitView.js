import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Nav, Row ,Tooltip,OverlayTrigger} from "react-bootstrap";
import Confirm from "../common/Confirm";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import PubSub from "pubsub-js";
import moment from "moment";
import MapLocation from "../MapLocation";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RelatedListFiles from "../RelatedListFiles";
import TaskEdit from "../task/TaskEdit";
import FilesCreate from "../FilesCreate";
import RelatedListTask from "../task/RelatedListTask";
import RelatedListArea from "../RelatedListArea";
import RelatedListHeight from "../RelatedLisHeight";
const SiteVisitView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [siteVisit, setSiteVisit] = useState(
    location.state ? location.state : {}
  );
  const [modalShowTask, setModalShowTask] = useState(false);
  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [relatedListTasks, setRelatedListTasks] = useState(false);
  const [relatedListFiles, setRelatedListFiles] = useState(true);
  const [refreshTaskList, setRefreshTaskList] = useState();
  const [refreshFileList, setRefreshFileList] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [actionButton, setActionButton] = useState({});
  const [lattitudeLongitude, setLattitudeLongitude] = useState({});
  const [relatedListArea, setRelatedListArea] = useState(false);
  const [relatedListHeight, setRelatedListHeight] = useState(false);

  useEffect(() => {
    fetchSiteVisit();
  }, []);


  const submitTasks = () => {
    setModalShowTask(false);
    setRefreshTaskList(Date.now());
  };
  const submitfiles = () => {
    ////.log('called:');
    setModalShowFile(false);
    setRefreshFileList(Date.now());
  };
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const handleSelect = (key) => {
    if (key === "tasks") {
      setRelatedListTasks(true);
      setRelatedListFiles(false);
    } else if (key === "files") {
      setRelatedListTasks(false);
      setRelatedListFiles(true);
    } else if (key === "leads") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
    }
    else if (key === "area") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedListArea(true);
      setRelatedListHeight(false);

    }
    else if (key === "height") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedListArea(false);
      setRelatedListHeight(true);

    }
  };

  function success(pos) {
    var crd = pos.coords;
    updateMethod(crd.latitude, crd.longitude)
    
  }

  async function updateMethod(lat,lag) {
    let finalValues = { id: siteVisit.id };
    if (siteVisit.status === "Not Visited") {
      finalValues = {
        ...finalValues,
        status: "Checked In",
        checkintime: moment().format("YYYY-MM-DD HH:mm:ss"),
        checkinlattitude: lat,
        checkinlongitude: lag,
      };
    } else if (siteVisit.status === "Checked In") {
      finalValues = {
        ...finalValues,
        status: "Checked Out",
        checkouttime: moment().format("YYYY-MM-DD HH:mm:ss"),
        checkoutlattitude: lat,
        checkoutlongitude: lag,
      };
    } else if (siteVisit.status === "Checked Out") {
      finalValues = { ...finalValues, status: "Visited" };
    }

    //.log("finalValues --> ", finalValues);

    const result = await inventoryApi.saveSiteVisitHistory(finalValues);
    //.log("result siteVisit", result);
    if (result) {
      setSiteVisit(result);
      //.log("if result true");
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Updated",
        message: "Status updated successfully",
      });
    }
  }

  function errors(err) {
    //.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (siteVisit.status === "Not Visited") {
      setActionButton({ buttonName: "Check In", logo: "fa-check" });
    } else if (siteVisit.status === "Checked In") {
      setActionButton({ buttonName: "Check Out", logo: "fa-xmark" });
    } else if (siteVisit.status === "Checked Out") {
      setActionButton({ buttonName: "Visited", logo: "fa-location-dot" });
    }
  }, [siteVisit]);

  const fetchSiteVisit = () => {
    //.log("from url lead id: ", location, siteVisit.id);

    ////.log('proepties ', siteVisit.id);
    async function initSiteVisitHistory() {
      let result = await inventoryApi.fetchSiteVisit(
        siteVisit.id ? siteVisit.id : id
      );
      //.log("get sitevisit history result --> ", result);
      if (result) {
        setSiteVisit(result);
      } else {
        setSiteVisit({});
      }
    }
    initSiteVisitHistory();
  };
  const updateStatus = async () => {
   
    if (siteVisit.status !== "Visited" && navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
           
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
    
          } else if (result.state === "denied") {
            callToast();
            window.location.href = "app-settings:location";
            //If denied then you have to show instructions to enable location
          }
        });
    }
    
   
    function callToast() {
      PubSub.publish("RECORD_ERROR_TOAST", {
        title: "Permission Issue",
        message: "Please give location permission",
      });
    }
      
  };

  const deleteContact = async () => {
    const result = await inventoryApi.deleteSiteVisit(siteVisit.id);
    if (result.success) navigate(`/sitevisit`);
  };

  const editContact = () => {
    //.log("siteVisit", siteVisit);
    navigate(`/sitevisit/${siteVisit.id}/e`, { state: siteVisit });
  };

  const ConvertToInventory = async () => {
    //.log("check-->", siteVisit, siteVisit.id, siteVisit.sitename);
    let passingdata = {
      name: siteVisit.sitename,
    };
    //.log("passingdata",passingdata)
    let result = await inventoryApi.createconvertinventory(siteVisit);
    //.log("result-->",result)
      if (result) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: result.message,
        });
        //.log('result.siteid',result.message)
        navigate(`/sitevisit/${siteVisit.id}`, { state: siteVisit });
      }
  };

  return (
    <div>
      <Container>
        <CustomSeparator
          cmpListName="Site Visits"
          currentCmpName={siteVisit.sitename}
          indexLength="2"
          url="/sitevisit"
        ></CustomSeparator>
      </Container>

      {siteVisit && (
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
          <Row className="view-form mx-1">
            <Col lg={1}></Col>
            <Col lg={10} className="ibs-form-section">
              <Row className="view-form-header align-items-center">
                <Col lg={6}>
                  Site Visit
                  <h4>{siteVisit.sitename}</h4>
                </Col>

                <Col lg={6} className="d-flex justify-content-end">
                  {siteVisit.status && siteVisit.status !== "Visited" && (
                    <Button
                      className="btn-sm mx-2 p-2"
                      onClick={() => updateStatus(true)}
                    >
                      {Object.values(actionButton).length > 0 && (
                        <>
                          {actionButton.buttonName}
                          &nbsp;&nbsp;
                          <i
                            class={`fa-solid ${actionButton.logo}`}
                            style={{ marginBottom: "0.3rem" }}
                          ></i>
                        </>
                      )}
                    </Button>
                  )}
                  {siteVisit.status === "Visited" &&
                    siteVisit.siteid === null && (
                      <Button
                        className="btn-sm mx-2"
                        onClick={() => ConvertToInventory(true)}
                      >
                        Convert
                      </Button>
                    )}
                  {siteVisit.status === "Visited" &&
                    siteVisit.siteid !== null && (
                      <Button
                        className="btn-sm mx-2"
                        onClick={() =>
                          navigate(`/properties/${siteVisit.siteid}`, {
                            state: { id: siteVisit.siteid },
                          })
                        }
                      >
                        Go To
                      </Button>
                    )}
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
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={() => setModalShow(true)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <label>Site</label>
                  <span>{siteVisit.sitename}</span>
                </Col>
                <Col lg={6}>
                  <label>Field Person</label>
                  <span>{siteVisit.fieldpersonname}</span>
                </Col>
                <Col lg={6}>
                  <label>Status</label>
                  <span>{siteVisit.status}</span>
                </Col>

                {/* --------------New Fields - saideep--------------- */}
                <Col lg={6}>
                  <label>Owner Name</label>
                  <span>{siteVisit.ownername}</span>
                </Col>
                <Col lg={6}>
                  <label>Owner Act Number</label>
                  <span>{siteVisit.owneractnumber}</span>
                </Col>
                <Col lg={6}>
                  <label>Second Contact Personname</label>
                  <span>{siteVisit.secondcontactpersonname}</span>
                </Col>
                <Col lg={6}>
                  <label>Second Contact Personphone</label>
                  <span>{siteVisit.secondcontactpersonphone}</span>
                </Col>
                <Col lg={6}>
                  <label>Email</label>
                  <span>{siteVisit.email}</span>
                </Col>
                <Col lg={6}>
                  <label>Property Type</label>
                  <span>{siteVisit.propertytype}</span>
                </Col>
                <Col lg={6}>
                  <label>Property Approval Status</label>
                  <span>{siteVisit.propertyapprovalstatus}</span>
                </Col>
                <Col lg={6}>
                  <label>Floor Map Available</label>
                  <span>{siteVisit.floormapavailable}</span>
                </Col>
                <Col lg={6}>
                  <label>Fire NOC Availble</label>
                  <span>{siteVisit.firenocavailble}</span>
                </Col>
                <Col lg={6}>
                  <label>No.of Floor</label>
                  <span>{siteVisit.nooffloor}</span>
                </Col>
                {/* <Col lg={6}>
                  <label>Property Area</label>
                  <span>{siteVisit.propertyarea}</span>
                </Col> */}
                {/* <Col lg={6}>
                  <label>Each Floor Height</label>
                  <span>{siteVisit.eachfloorheight}</span>
                </Col> */}
                <Col lg={6}>
                  <label>Frontage</label>
                  <span>{siteVisit.frontage}</span>
                </Col>
                <Col lg={6}>
                  <label>No. of Entries</label>
                  <span>{siteVisit.noofentries}</span>
                </Col>
                <Col lg={6}>
                  <label>Lift Available</label>
                  <span>{siteVisit.liftavailable}</span>
                </Col>
                <Col lg={6}>
                  <label>Parking Space</label>
                  <span>{siteVisit.parkingspace}</span>
                </Col>
                <Col lg={6}>
                  <label>Previous Brand</label>
                  <span>{siteVisit.previousbrand}</span>
                </Col>
                <Col lg={6}>
                  <label>Location</label>
                  <span>{siteVisit.location}</span>
                </Col>
                <Col lg={6}>
                  <label>Location Area</label>
                  <span>{siteVisit.locationarea}</span>
                </Col>
                <Col lg={6}>
                  <label>Expected Rent</label>
                  <span>{siteVisit.expectedrent}</span>
                </Col>
                <Col lg={6}>
                  <label>Description</label>
                  <span>{siteVisit.description}</span>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  {siteVisit.status !== "Not Visited" && (
                    <>
                      <label>Check In Date & Time :</label>
                      <span>
                        {moment(siteVisit.checkintime).format(
                          "DD-MM-YYYY hh:mm A"
                        )}
                      </span>
                    </>
                  )}
                </Col>

                <Col lg={6}>
                  {siteVisit.status !== "Not Visited" &&
                    siteVisit.status !== "Checked In" && (
                      <>
                        <label>Check Out Date & Time :</label>
                        <span>
                          {moment(siteVisit.checkouttime).format(
                            "DD-MM-YYYY hh:mm A"
                          )}
                        </span>
                      </>
                    )}
                </Col>
                <Col>
                  {siteVisit.status !== "Not Visited" && (
                    <>
                      <label>Check In/Out Location</label>
                      <MapLocation sitevisit={siteVisit} />
                    </>
                  )}
                </Col>
                <Col lg={6}>
                  <label>Created By</label>
                  <span>{siteVisit.createdbyname}</span>
                </Col>
                <Col lg={6}>
                  <label>Created date </label>
                  <span>
                    {moment(siteVisit.createddate).format("DD-MM-YYYY hh:mm A")}
                  </span>
                </Col>
                <Col lg={6}>
                  <label>Last modifieddate</label>
                  <span>
                    {moment(siteVisit.lastmodifieddate).format(
                      "DD-MM-YYYY hh:mm A"
                    )}
                  </span>
                </Col>
                <Col lg={6}>
                  <label>lastmodifieddateby</label>
                  <span>{siteVisit.lastmodifiedbyname}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Card bg="light" text="light" className="mb-2 mt-4">
            <Card.Header className="d-flex justify-content-between">
              <Tabs
                defaultActiveKey="files"
                id="uncontrolled-tab-example"
                onSelect={(key) => handleSelect(key)}
              >
                {/* <Tab eventKey="leads" title="Intrested Leads"></Tab> */}
                <Tab eventKey="files" title="Files"></Tab>
                <Tab eventKey="tasks" title="Tasks"></Tab>
                <Tab eventKey="area" title="Area"></Tab>
                  <Tab eventKey="height" title="Height"></Tab>
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
                  parentid={siteVisit.id}
                  table="siteVisit"
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
                  parent={siteVisit}
                  table="sitevisit"
                  submitfiles={submitfiles}
                />
              )}
            </Card.Header>
            <Card.Body>
              {relatedListTasks ? (
                <RelatedListTask
                  refreshTaskList={refreshTaskList}
                  parent={siteVisit}
                />
              ) : (
                ""
              )}
              {relatedListFiles ? (
                <RelatedListFiles
                  refreshFileList={refreshFileList}
                  parent={siteVisit}
                  table="siteVisit"
                />
              ) : (
                ""
              )}
                      {relatedListArea ? (
                <RelatedListArea
                  //refreshAreaList={modalShowArea}
                  parent={siteVisit}
                  table="lead"
                />
                ) : (
                  ""
                )}
                {relatedListHeight ? (
                <RelatedListHeight
                  //refreshAreaList={modalShowHeight}
                  parent={siteVisit}
                  table="lead"
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

export default SiteVisitView;
