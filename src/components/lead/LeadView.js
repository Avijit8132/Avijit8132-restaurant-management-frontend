import React, { useState, useEffect } from "react";

import { Badge, Button, Card, Col, Container, Row, Tooltip, OverlayTrigger } from "react-bootstrap";
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
import moment from "moment";
import RelatedListEmails from "../RelatedListEmails";
import RelatedListArea from "../RelatedListArea";
import RelatedLisHeight from "../RelatedLisHeight";

const LeadView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lead, setLead] = useState(location.state ? location.state : {});
  const [leadStatusArray, setleadStatusArray] = useState(
    JSON.parse(localStorage.getItem("lead_status"))
  );
  //console.log('leadStatusArray1', JSON.parse(localStorage.getItem("lead_status")));
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEmail, setModalShowEmail] = useState(false);
  const [modalShowTask, setModalShowTask] = useState(false);
  const [modalShowArea, setModalShowArea] = useState(false);
  const [modalShowHeight, setModalShowHeight] = useState(false);

  const [relatedListTasks, setRelatedListTasks] = useState(true);
  const [relatedListFiles, setRelatedListFiles] = useState(false);
  const [relatedListEmails, setRelatedListEmails] = useState(false);
  const [relatedListArea, setRelatedListArea] = useState(false);
  const [relatedListHeight, setRelatedListHeight] = useState(false);

  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [refreshFileList, setRefreshFileList] = useState();
  const [refreshTaskList, setRefreshTaskList] = useState(Date.now());
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isOverlayDeleteVisible, setIsDeleteOverlayVisible] = useState(false);
  const VerticalColors = {
    'Open': "#8E969C",
    'Close': "#C5E7E2",
    'Pending': "#EDF0A7",
    'Negotiation Stage': "#A9D1D7",
    'Due Diligence Stage': "#A1DAD7",
    'Upload File Stage': "#8BD0D0",
    'Tenure': "#6BAAAE",
    'Neighboring Brands': "#B4D3C4",
    'Stamp Duty': "#ADC3B4",
    'Registration Cost': "#8C9FA0",
    'Maintenance Charges': "#00C0A3",
    'Possession Timeline': "#30949D",

  };
  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = () => {
    if (
      !lead.id &&
      location.hasOwnProperty("pathname") &&
      location.pathname.split("/").length >= 3
    ) {
      lead.id = location.pathname.split("/")[2];
      setRefreshFileList(Date.now());
      setRefreshTaskList(Date.now());
    }

    async function initLead() {
      let result = await inventoryApi.fetchLead(lead.id);
      if (result) {
        setLead(result);
      } else {
        setLead({});
      }
    }
    initLead();
  };
  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };

  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
  };
  const handleDeleteMouseEnter = () => {
    setIsDeleteOverlayVisible(true);
  };

  const handleDeleteMouseLeave = () => {
    setIsDeleteOverlayVisible(false);
  };
  const deleteLead = async () => {
    const result = await inventoryApi.deleteLead(lead.id);
    if (result.success) navigate(`/leads`);
  };

  const editLead = () => {
    navigate(`/leads/${lead.id}/e`, { state: lead });
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
      setRelatedListEmails(false);
      setRelatedListArea(false);
      setRelatedListHeight(false);

    } else if (key === "files") {
      setRelatedListTasks(false);
      setRelatedListFiles(true);
      setRelatedListEmails(false);
      setRelatedListArea(false);
      setRelatedListHeight(false);

    } else if (key === "emails") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedListEmails(true);
      setRelatedListArea(false);
      setRelatedListHeight(false);
    }
    else if (key === "area") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedListEmails(false);
      setRelatedListArea(true);
      setRelatedListHeight(false);

    }
    else if (key === "height") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedListEmails(false);
      setRelatedListArea(false);
      setRelatedListHeight(true);

    }
  };

  return (
    <div>
      <Container>
        <CustomSeparator
          cmpListName="Leads"
          currentCmpName={lead.firstname + " " + lead.lastname}
          indexLength="2"
          url="/leads"
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
            <Col lg={8}>
              <Row className="view-form-header align-items-center">
                <Col lg={6}>
                  Lead
                  <h4>{lead.firstname + " " + lead.lastname}</h4>
                </Col>
                <Col lg={6} className="d-flex justify-content-end">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Call</Tooltip>}
                  >
                    <Button
                      className="btn-sm"
                      href={`tel:${lead.phone}`}
                      variant="success"
                    >
                      <i class="fa fa-phone"></i>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    show={isOverlayVisible}
                    overlay={
                      <Tooltip className="my-tooltip">Send Email</Tooltip>
                    }
                  >
                    <Button
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="btn-sm mx-2"
                      onClick={() => setModalShowEmail(true)}
                      variant="success"
                    >
                      <i class="fa fa-envelope"></i>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                  >
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editLead(true)}
                    >
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
                      className="btn-sm"
                      variant="danger"
                      onClick={() => setModalShow(true)}
                    >
                      <i class="fa fa-trash"></i>
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
              <Row
                className="py-3 ibs-edit-form"
                style={{ backgroundColor: "#fff" }}
              >

                <Col lg={12}>
                  <Path
                    values={leadStatusArray}
                    selectedValue={lead.leadstage}
                  />
                </Col>

                <Col lg={4}>
                  <label>Name</label>
                  <span>
                    {lead.salutation} {lead.firstname} {lead.lastname}
                  </span>
                </Col>
               {lead.designation && <Col lg={4}>
                  <label>Designation</label>
                  <span>{lead.designation}</span>
                </Col>}
              {lead.phone &&   <Col lg={4}>
                  <label>Phone</label>
                  <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                </Col>}
                {lead.email && <Col lg={4}>
                  <label>Email</label>
                  <span>{lead.email}</span>
                </Col>}
               {lead.leadsource &&  <Col lg={4}>
                  <label>Lead Source</label>
                  <span>{lead.leadsource}</span>
                </Col>}
              {lead.leadstage &&   <Col lg={4}>
                  <label>Stage</label>
                  <Badge
                    bg={lead.leadstage !== null ? lead.leadstage === "test leadstage" ? "#FAC2A4" : VerticalColors[lead.leadstage] : ""}
                    // bg={VerticalColors[lead.leadstage]}
                    style={{
                      backgroundColor: lead.leadstage === "test leadstage" ? "#FAC2A4" : VerticalColors[lead.leadstage],
                      // background: VerticalColors[lead.leadstage],
                      color: "black",
                      width: "160px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {lead.leadstage}
                  </Badge>
                </Col>}
               {lead.alternatephone &&  <Col lg={4}>
                  <label>Alternate Phone</label>
                  <span>{lead.alternatephone}</span>
                </Col>}
                {lead.clienttype && <Col lg={4}>
                  <label>Client Type</label>
                  <span>{lead.clienttype}</span>
                </Col>}
               {lead.company &&  <Col lg={4}>
                  <label>Company</label>
                  <span>{lead.company}</span>
                </Col>}
               {lead.office &&  <Col lg={4}>
                  <label>Office Address</label>
                  <span>{lead.office}</span>
                </Col>}
                <Col lg={4}>
                  <label>Assigned Staff</label>
                  <span>
                    <Link to={`/users/${lead.ownerid}`}>{lead.ownername}</Link>
                  </span>
                </Col>
               {lead.clientstate &&  <Col lg={4}>
                  <label>State</label>
                  <span>{lead.clientstate}</span>
                </Col>}
               {lead.clientcity &&  <Col lg={4}>
                  <label>City</label>
                  <span>{lead.clientcity}</span>
                </Col>}
               {lead.clientstreet &&  <Col lg={4}>
                  <label>Street</label>
                  <span>{lead.clientstreet}</span>
                </Col>}
               {lead.clientpincode &&  <Col lg={4}>
                  <label>Pincode</label>
                  <span>{lead.clientpincode}</span>
                </Col>}
                {lead.clientcountry && <Col lg={4}>
                  <label>Country</label>
                  <span>{lead.clientcountry}</span>
                </Col>}
               {lead.zone &&  <Col lg={4}>
                  <label>Zone</label>
                  <span>{lead.zone}</span>
                </Col>}

                {lead.clientcalloption && <Col lg={4}>
                  <label>Third Party</label>
                  <span>{lead.clientcalloption}</span>
                </Col>}
               {lead.clientcalloptionname &&  <Col lg={4}>
                  <label>Third Party Name</label>
                  <span>{lead.clientcalloptionname}</span>
                </Col>}
               {lead.clientcalloptionmobile &&  <Col lg={4}>
                  <label>Third Party Mobile</label>
                  <span>{lead.clientcalloptionmobile}</span>
                </Col>}
               {lead.clientcalloptionemail &&  <Col lg={4}>
                  <label>Third Party Email</label>
                  <span>{lead.clientcalloptionemail}</span>
                </Col>}

                {lead.clientcalloptiondate && <Col lg={4}>
                  <label>Third Party Date</label>
                  <span>{lead.clientcalloptiondate}</span>
                </Col>}
               {lead.clientcalloptionremark &&  <Col lg={4}>
                  <label>Third Party Remarks</label>
                  <span>{lead.clientcalloptionremark}</span>
                </Col>}
                {lead.clientcalloptionratepersqfeet && <Col lg={4}>
                  <label>Third Party Rate/Sq feet</label>
                  <span>{lead.clientcalloptionratepersqfeet}</span>
                </Col>}
                {lead.clientcalloptionbrokerage && <Col lg={4}>
                  <label>Third Party Brokarage</label>
                  <span>{lead.clientcalloptionbrokerage}</span>
                </Col>}
               {lead.transactiontype &&  <Col lg={4}>
                  <label>Transaction Type</label>
                  <span>{lead.transactiontype}</span>
                </Col>}
               {lead.typeofclient &&  <Col lg={4}>
                  <label>Type Of Client</label>
                  <span>{lead.typeofclient}</span>
                </Col>}
               {lead.vertical &&  <Col lg={4}>
                  <label>Vertical </label>
                  <span>{lead.vertical}</span>
                </Col>}
              {lead.verticaltype &&   <Col lg={4}>
                  <label>Vertical Type</label>
                  <span>{lead.verticaltype}</span>
                </Col>}
              {lead.subverticaltype &&   <Col lg={4}>
                  <label>Sub Vertical Type</label>
                  <span>{lead.subverticaltype}</span>
                </Col>}

               {lead.numberofcarortruckparking &&  <Col lg={4}>
                  <label># of Car/ Truck Parking</label>
                  <span>{lead.numberofcarortruckparking}</span>
                </Col>}
               {lead.type &&  <Col lg={4}>
                  <label>Type</label>
                  <span>{lead.type}</span>
                </Col>}
                {lead.otherdetails && <Col lg={4}>
                  <label>Other Details</label>
                  <span>{lead.otherdetails}</span>
                </Col>}

                {lead.otherlocations && <Col lg={4}>
                  <label>Other Locations</label>
                  <span>{lead.otherlocations}</span>
                </Col>}
               
                {lead.completiondate && <Col lg={4}>
                  <label>Completion Date</label>
                  <span>{lead.completiondate}</span>
                </Col>}
               {lead.frontage &&  <Col lg={4}>
                  <label>Frontage</label>
                  <span>{lead.frontage}</span>
                </Col>}
               {lead.areaorlocationbrief &&  <Col lg={4}>
                  <label>Area/Location Brief</label>
                  <span>{lead.areaorlocationbrief}</span>
                </Col>}
                {lead.verticaltype === "Warehousing" && (
                  <Col lg={4}>
                    <label>No. of docks </label>
                    <span>{lead.noofdocksvalue}</span>
                  </Col>
                )}
                {lead.verticaltype === "Warehousing" && (
                  <Col lg={4}>
                    <label>No.of Washrooms</label>
                    <span>{lead.noofwashroomsvalue}</span>
                  </Col>
                )}
                {lead.verticaltype === "Warehousing" && (
                  <Col lg={4}>
                    <label>Open area</label>
                    <span>
                      {lead.openareaunit !== null ? lead.openareaunit : " "}{" "}
                      {lead.openareavalue !== null ? lead.openareavalue : ""}
                    </span>
                  </Col>
                )}
                {lead.verticaltype === "Warehousing" && (
                  <Col lg={4}>
                    <label>Close area</label>
                    <span>
                      {lead.closeareaunit !== null ? lead.closeareaunit : " "}{" "}
                      {lead.closeareavalue !== null ? lead.closeareavalue : " "}
                    </span>
                  </Col>
                )}
                {lead.verticaltype === "Warehousing" && (
                  <Col lg={4}>
                    <label>Rental</label>
                    <span>
                      {lead.rentalunit !== null ? lead.rentalunit : " "}
                      {lead.rentalvalue !== null ? lead.rentalvalue : " "}
                    </span>
                  </Col>
                )}


                <Col lg={4}>
                  <label>Created By</label>
                  <span>{lead.createdbyname}</span>
                </Col>
                <Col lg={4}>
                  <label>Created date </label>
                  <span>
                    {moment(lead.createddate).format("DD-MM-YYYY hh:mm A")}
                  </span>
                </Col>
                <Col lg={4}>
                  <label>Last modifieddate</label>
                  <span>
                    {moment(lead.lastmodifieddate).format("DD-MM-YYYY hh:mm A")}
                  </span>
                </Col>
                <Col lg={4}>
                  <label>lastmodifieddateby</label>
                  <span>{lead.lastmodifiedbyname}</span>
                </Col>
              </Row>
            </Col>
            <Col lg={4}>
              <Chat parentid={lead.id} />
            </Col>
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
                <Tab eventKey="emails" title="Emails"></Tab>
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
              {relatedListEmails ? (
                <RelatedListEmails
                  refreshEmailList={modalShowEmail}
                  parent={lead}
                  table="property"
                />
              ) : (
                ""
              )}
              {relatedListArea ? (
                <RelatedListArea
                  refreshAreaList={modalShowArea}
                  parent={lead}
                  table="lead"
                />
              ) : (
                ""
              )}
              {relatedListHeight ? (
                <RelatedLisHeight
                  refreshAreaList={modalShowHeight}
                  parent={lead}
                  table="lead"
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

export default LeadView;

