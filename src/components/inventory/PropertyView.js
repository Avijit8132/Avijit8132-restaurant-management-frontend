import React, { useState, useEffect, useRef } from "react";
import { Badge, Button, Card, Col, Container, Row,Tooltip,OverlayTrigger  } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import FilesCreate from "../FilesCreate";
import RelatedListFiles from "../RelatedListFiles";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TaskEdit from "../task/TaskEdit";
import html2canvas from "html2canvas";
import EmailComposer from "../common/EmailComposer";
import RelatedLead from "../RelatedLead";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailIcon,
  WhatsappIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
} from "react-share";
import jwt_decode from "jwt-decode";
import * as constants from "../../constants/CONSTANT";
import moment from "moment";
import Chat from "../common/Chat";
import Confirm from "../common/Confirm";
import RelatedListTask from "../task/RelatedListTask";
import RelatedListPDF from "../RelatedListPDF";
import {DefaultPdfValues, SectionInTemplateValues,pdfValuesDefault} from "../../constants/DefalutPdfValues.js"
import RelatedListArea from "../RelatedListArea.js";
import RelatedListHeight from "../RelatedLisHeight.js";

const PropertyView = (props) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [property, setProperty] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [modalShowTask, setModalShowTask] = useState(false);
  const [modalShowArea, setModalShowArea] = useState(false);
  const [modalShowHeight, setModalShowHeight] = useState(false);
  const [relatedListTasks, setRelatedListTasks] = useState(false);
  const [relatedListFiles, setRelatedListFiles] = useState(true);
  const [relatedListPdf, setRelatedListPdf] = useState(false);
  const [relatedListArea, setRelatedListArea] = useState(false);
  const [relatedListHeight, setRelatedListHeight] = useState(false);
  const [relatedLeads, setRelatedLeads] = useState(false);
  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [modalShowPdf, setModalShowPdf] = useState(false);
  const [refreshTaskList, setRefreshTaskList] = useState();
  const [refreshFileList, setRefreshFileList] = useState();
  const [showTransactionModel, setShowTransactionModel] = useState(false);
  const [modalShowEmail, setModalShowEmail] = useState(false);
  const [type, setType] = useState("Income");

  const [showVideo, setShowVideo] = useState(Boolean(property.vidurl));

  const [imageURL, setImageURL] = useState();

  const [showSocial, setShowSocial] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isOverlayDeleteVisible, setIsDeleteOverlayVisible] = useState(false);
  const VerticalColors = {
    Office: "#82eedd",
    Land: "#c9ee82",
    Retail: "#ff80ed",
    Investment: "#e3c6ff",
    Logistic: "#00d5ff",
    Warehouse: "#d0ae8b",
    Others: "#7f72a2",
  };

  const redirectPDF = async () => {
    let pdfBuilderData = JSON.parse(JSON.stringify(DefaultPdfValues));
    pdfBuilderData['propertyData'] = property;
    let files = await inventoryApi.fetchFiles(property.id);

    //change the pdfBuilderData as per property data
    pdfValuesDefault.forEach(e=> {
      let sectionKey = e.label.split('.')
      if(property[e.value])
        pdfBuilderData[sectionKey[0]][sectionKey[1]] = property[e.value]; 
    })
    // pdfBuilderData['secondpage']['State'] = property.state
        //////.log(files)
    if (files && files?.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        //.log('file :>> ', file);
        if(file?.sectionintemplate && file.sectionintemplate !== '' && SectionInTemplateValues.includes(file.sectionintemplate)){
          const result = await inventoryApi.downloadFiles(file);
          let fileLink = window.URL.createObjectURL(result);
          let sectionKey = file.sectionintemplate.split('.')
          if(sectionKey.length === 2){
            //.log('size is 2');
            pdfBuilderData[sectionKey[0]][sectionKey[1]] = fileLink 
          }else if(sectionKey.length === 1){
            //.log('size is 1');
            pdfBuilderData[sectionKey[0]] = fileLink
          }
        }
      }
    }
    //.log('redirectpdf Report builder', pdfBuilderData)
    navigate(`/pdfbuilder/${property.id}`, { state: pdfBuilderData });
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
  const printRef = useRef();
 
  /* Start yamini 06-09-2023 */

  async function fetchImageURL() {
    let user = jwt_decode(localStorage.getItem("token"));
    let files = await inventoryApi.fetchFiles(property.id);
    let imageFiles = files?.filter((file) => {
      return file?.documenttype === "property_image";
    });
    if (imageFiles?.length) {
      let image =
        constants.PROJECT_BASE_URL +
        "/images/" +
        user.tenantcode +
        "/" +
        property.id +
        "/" +
        imageFiles[0].id +
        "." +
        imageFiles[0].filetype;
      setImageURL(image);
    } else {
      setImageURL("/NoFound.svg");
    }
  }

  /* End yamini 06-09-2023 */
  useEffect(() => {
    if (!window.myMap) {
      window.myMap = myMap;
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDkVza2FtLItgn_kzJ27_A4l2Eyf3ZrOOI&callback=myMap`;
      googleMapScript.async = true;
      window.document.body.appendChild(googleMapScript);
    } else {
      myMap();
    }
    fetchProperty();
    fetchImageURL();
  }, []);

  const fetchProperty = () => {
    // Coming from Email
    if (
      !property.id &&
      location.hasOwnProperty("pathname") &&
      location.pathname.split("/")?.length >= 3
    ) {
      property.id = location.pathname.split("/")[2];
    }

    async function initProperty() {
      let result = await inventoryApi.fetchProperty(property.id);
      //.log('resultresult',result,property);
      if (result) {
        setProperty(result);
      } else {
        setProperty({});
      }
    }
    initProperty();
  };
  useEffect(() => {
    setRefreshFileList(Date.now());
  }, [property]);
 
  const deleteProperty = async () => {
    const result = await inventoryApi.deleteProperty(property.id);
    if (result) navigate(`/properties`);
  };

  const editLead = () => {
    navigate(`/properties/${property.id}/e`, { state: property });
  };

  const submitTasks = () => {
    setModalShowTask(false);
    setRefreshTaskList(Date.now());
    setModalShowEmail(false);
  };
  const submitfiles = () => {
    setModalShowFile(false);
    setRefreshFileList(Date.now());
  };
  const submitpdf = () => {
    setModalShowPdf(false);
    setRefreshFileList(Date.now());
  };

  const handleSelect = (key) => {
    if (key === "tasks") {
      setRelatedListTasks(true);
      setRelatedListFiles(false);
      setRelatedLeads(false);
      setRelatedListPdf(false);
      setRelatedListArea(false);
      setRelatedListHeight(false);

    } else if (key === "files") {
      setRelatedListTasks(false);
      setRelatedListFiles(true);
      setRelatedLeads(false);
      setRelatedListPdf(false);
      setRelatedListArea(false);
      setRelatedListHeight(false);

    } else if (key === "leads") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedLeads(true);
      setRelatedListPdf(true);
      setRelatedListArea(false);
      setRelatedListHeight(false);

    } else if (key === "pdf") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedLeads(false);
      setRelatedListPdf(true);
      setRelatedListArea(false);
      setRelatedListHeight(false);

    }
    else if (key === "area") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedLeads(false);
      setRelatedListPdf(false);
      setRelatedListArea(true);
      setRelatedListHeight(false);

    }
    else if (key === "height") {
      setRelatedListTasks(false);
      setRelatedListFiles(false);
      setRelatedLeads(false);
      setRelatedListPdf(false);
      setRelatedListArea(false);
      setRelatedListHeight(true);

    }
  };

  const myMap = () => {
    let contentString = `<h4>${property.name}</h4>
    <label className='maplabel'>Address:</label> <p>${property.street},${property.city},${property.state},${property.pincode},${property.country}</p>
    <label className='maplabel'>Contact Person:</label> <p> ${property.contactname} </p>
    <label className='maplabel'>Description:</label> <p> ${property.description} </p>`;
    const infowindow = new window.google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "Uluru",
    });

    var mapProp = {
      center: new window.google.maps.LatLng(51.508742, -0.12085),
      zoom: 14,
    };
    var map = new window.google.maps.Map(
      document.getElementById("googleMap"),
      mapProp
    );

    var geocoder = new window.google.maps.Geocoder();
    var address = `${property.street},${property.city},${property.state},${property.pincode},${property.country}`;
    geocoder.geocode({ address: address }, function (results, status) {
      if (status == window.google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new window.google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: `${property.name}`,
        });

        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
          });
        });
      }
    });
  };

  const handleSocialIcon = () => {
    setShowSocial(!showSocial);
  };
 
  return (
    <div>
      <Container>
        <CustomSeparator
          cmpListName="Inventory"
          currentCmpName={property.name}
          indexLength="2"
          url="/properties"
        ></CustomSeparator>
      </Container>
      {property && (
        <Container className="mt-4">
          {modalShow && (
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteProperty={deleteProperty}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="property"
            />
          )}
          <div ref={printRef} >
            <Row className="view-form gx-5 px-4">
              <Col lg={8} >
                <Row className="view-form-header align-items-center">
                  <Col lg={6}>
                    Inventory
                    <h4>{property.name}</h4>
                  </Col>
                  <Col lg={6} className="d-flex justify-content-end">
                  <OverlayTrigger
                   placement="top"
                   show={isOverlayVisible}
                   overlay={<Tooltip className="my-tooltip">Send Email</Tooltip>}
                  >
                    <Button
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="btn-sm"
                        onClick={() => setModalShowEmail(true)}
                        variant="success"
                      
                      >
                        <i class="fa fa-envelope "></i>
                    </Button>
                  </OverlayTrigger> 
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">PDF</Tooltip>}
                >
                  <Button
                    className="btn-sm mx-2"
                    onClick={() => redirectPDF()}
                    variant="success"
                  >
                    <i class="fa fa-file-pdf"></i>
                  </Button>

                  </OverlayTrigger>
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
                >
                  <Button
                    className="btn-sm "
                    onClick={() => editLead(true)}
                  >

                    <i className="fa fa-pen-to-square"></i>
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
                    onClick={() => setModalShow(true)}
                  >
                    <i class="fa fa-trash"></i>
                  </Button>

                  </OverlayTrigger>
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="my-tooltip">Share</Tooltip>}
                >
                  <div
                    tabIndex={0}
                    onClick={handleSocialIcon}
                    // onBlur={handleSocialIcon}
                    style={{ cursor: "pointer", textAlign: "center" }}
                  >
                    <img
                      src="/share-svgrepo-com.svg"
                      width="24px"
                      style={{ borderRadius: "5px" }}
                    />
                    {showSocial && (
                        
                      
                      <div
                        style={{
                          position: "absolute",
                          zIndex: "100",
                          borderRadius: "10px",
                          padding: ".5rem",
                          backgroundColor: "#f0f1f1",
                        }}
                      >
                        <EmailShareButton
                          url={imageURL}
                          className="mx-1 mb-1"
                        >
                          <EmailIcon size={24} round />
                        </EmailShareButton>
                        <br></br>
                        <FacebookShareButton
                          url={imageURL}
                          className="mx-1 mb-1"
                        >
                          <FacebookIcon size={24} round />
                        </FacebookShareButton>
                        <br></br>
                        <WhatsappShareButton
                          url={imageURL}
                          className="mx-1 mb-1"
                        >
                          <WhatsappIcon size={24} round />
                        </WhatsappShareButton>
                        <br></br>
                        <LinkedinShareButton
                          url={imageURL}
                          className="mx-1 mb-1"
                        >
                          <LinkedinIcon size={24} round />
                        </LinkedinShareButton>
                        <br></br>
                        <TelegramShareButton
                          url={imageURL}
                          className="mx-1 mb-1"
                        >
                          <TelegramIcon size={24} round />
                        </TelegramShareButton>
                        <br></br>
                        <TwitterShareButton
                          className="mx-1 mb-1"
                          url={imageURL}
                        >
                          <TwitterIcon size={24} round />
                        </TwitterShareButton>
                      </div>
                    )}
                  </div>
                  </OverlayTrigger>
                  </Col>
                </Row>
                <Row
                className="py-3 ibs-edit-form"
                style={{ backgroundColor: "#fff" ,
              }}>

                  <Col lg={4}>
                    <label>Property Name</label>
                    <span>{property.name}</span>
                  </Col>
                { property.contactname && <Col lg={4}>
                    <label>Contact Person</label>
                    <span>
                      <Link to={`/contacts/${property.contactid}`}>
                        {property.contactname || <br />}
                      </Link>
                    </span>
                  </Col>}
                  {property.transactiontype === "Lease" && <Col lg={4}>
                    <label>Lease Expiration Date</label>
                    <span>{property.leaseexpirationdate} </span>
                  </Col> }
                  {/* <Col lg={4}>
                    <label>Super Built Area</label>
                    <span>{property.superbuiltuparea} </span>
                  </Col> */}
                  {/* <Col lg={4}>
                    <label>Floor</label>
                    <span>{property.floor} </span>
                  </Col>
                  <Col lg={4}>
                    <label>Area To From</label>
                    <span>{property.arearangein}&ensp;{property.area}&nbsp;&nbsp;{property.areato}</span>
                  </Col> */}
                  <Col lg={4}>
                    <label>Transaction</label>
                    <span>{property.transactiontype}</span>
                  </Col>
                  <Col lg={4}>
                    <label>Type Of client</label>
                    <span>{property.typeofclient} </span>
                  </Col>
                  <Col lg={4}>
                    <label>Vertical</label>       
                      <Badge
                        bg={property.vertical !== null ?  property.vertical === "Logistic and Warehouse" ? "#E8EB96" : VerticalColors[property.vertical] : ""}
                        style={{
                          display: "block",
                          paddingBottom: "5px",
                          backgroundColor: property.vertical === "Logistic and Warehouse" ? "#E8EB96" : VerticalColors[property.vertical],
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {property.vertical}
                      </Badge>
              
                  </Col>
                  <Col lg={4}>
                    <label>Vertical Type</label>
                    <span>{property.verticaltype} </span>
                  </Col>
                  <Col lg={4}>
                    <label>Sub Vertical Type</label>
                    <span>{property.subverticaltype}</span>
                  </Col>
                  {/* <Col lg={4}>
                    <label>Property Base</label>
                    <span>{property.propertybase}</span>
                  </Col> */}
                {property.possessionstatus && <Col lg={4}>
                  <label>Possession Status</label>
                  <span>{property.possessionstatus}</span>
                </Col>}
                 {property.Possessiondate && <Col lg={4}>
                    <label>Possession Date</label>
                    <span>{moment(property.Possessiondate).format("DD-MM-YYYY")}</span>
                  </Col>}
                 {property.propertytype &&  <Col>
                  <label>Property Type</label>
                  <span>{property.propertytype}</span>
                  </Col>}
                 {property.furnishedstatus &&  <Col lg={4}>
                    <label>Furnished</label>
                    <span>{property.furnishedstatus}</span>
                  </Col>}
                  {property.verticaltype ==="Warehousing" && <Col lg={4}>
                  <label>No. of docks </label>
                  <span>{property.noofdocksvalue}</span>
                </Col>}
                {property.verticaltype ==="Warehousing" && <Col lg={4}>
                  <label>No.of Washrooms</label>
                  <span>{property.noofwashroomsvalue}</span>
                </Col>}
                {property.verticaltype ==="Warehousing" && <Col lg={4}>
                  <label>Open area</label>
                  <span>{property.openareaunit !== null ? property.openareaunit : " "}  {(property.openareavalue) !== null ? property.openareavalue : "" }</span>
                </Col>}
                {property.verticaltype ==="Warehousing" && <Col lg={4}>
                  <label>Close area</label>
                  <span>{property.closeareaunit !== null ? property.closeareaunit : " "} { property.closeareavalue !== null ? property.closeareavalue : " " }</span>
                </Col>}
                {property.verticaltype ==="Warehousing" && <Col lg={4}>
                  <label>Rental</label>
                  <span>{property.rentalunit !== null ? property.rentalunit : " " }{ property.rentalvalue !== null ? property.rentalvalue : " " }</span>
                </Col>}
                 {property.description &&  <Col lg={4}>
                    <label>Description</label>
                    <span>{property.description}</span>
                  </Col>}
                 {property.state &&  <Col lg={4}>
                    <label>State</label>
                    <span>{property.state}</span>
                  </Col>}
                 {property.city &&  <Col lg={4}>
                    <label>City</label>
                    <span>{property.city}</span>
                  </Col>}
                {property.street &&   <Col lg={4}>
                    <label>Street</label>
                    <span>{property.street}</span>
                  </Col>}
                {property.pincode &&   <Col lg={4}>
                    <label>Pincode</label>
                    <span>{property.pincode}</span>
                  </Col>}
                  <Col lg={4}>
                    <label>Country</label>
                    <span>{property.country}</span>
                  </Col> 

                 {property.officestreet &&  <Col lg={4}>
                    <label>Office street</label>
                    <span>{property.officestreet}</span>
                  </Col>}
                 {property.officestate &&  <Col lg={4}>
                    <label>Office state</label>
                    <span>{property.officestate}</span>
                  </Col>}
                 {property.officecity &&  <Col lg={4}>
                    <label>Office city</label>
                    <span>{property.officecity}</span>
                  </Col>}
                 {property.officepincode &&  <Col lg={4}>
                    <label>Office pincode</label>
                    <span>{property.officepincode}</span>
                  </Col>}
                   {console.log('property',property)}
                 {property.createdbyname &&  <Col lg={4}>
                  <label>Created By</label>
                  <span>{property.createdbyname}</span>
                </Col>}
               {property.createddate &&  <Col lg={4}>
                  <label>Created date </label>
                  <span>{moment(property.createddate).format("DD-MM-YYYY hh:mm A")}</span>
                </Col>}
               {property.lastmodifieddate &&  <Col lg={4}>
                  <label>Last modifieddate</label>
                  <span>{moment(property.lastmodifieddate).format("DD-MM-YYYY hh:mm A")}</span>
                </Col>}
                {property.lastmodifiedbyname && <Col lg={4}>
                  <label>lastmodifieddateby</label>
                  <span>{property.lastmodifiedbyname}</span>
                </Col>}
                  <Col></Col>
                </Row>
              </Col>
            <Col lg={4} >
             <Row>
                <Col lg={12}>
                  <Chat parentid={property.id} />
                  </Col>
                  <span></span>
              <Col>
                <div
                  id="googleMap"
                  style={{ width: "100%", height: "278px" }}
                ></div>
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
                  <Tab eventKey="files" title="Files"></Tab>
                  <Tab eventKey="tasks" title="Tasks"></Tab>
                  <Tab eventKey="pdf" title="PDF"></Tab>
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
                    parentid={property.id}
                    table="property"
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
                  parent={property}
                  table="property"
                  submitfiles={submitfiles}
                  />
                  )}
                  {relatedListPdf && (
                    <Button
                      className="float-right btn-sm"
                      onClick={() => setModalShowPdf(true)}
                    >
                      Upload Pdf
                    </Button>
                  )}
                  {modalShowPdf && (
                    <FilesCreate
                      show={modalShowPdf}
                      onHide={() => setModalShowPdf(false)}
                      parent={property}
                      table="property"
                      file='pdf'
                      submitfiles={submitpdf}
                    />
                  )}
              </Card.Header>
              <Card.Body>
                {property && property.id && relatedLeads && (
                  <RelatedLead parent={property} />
                )}
                {relatedListTasks ? (
                  <RelatedListTask
                    refreshTaskList={refreshTaskList}
                    parent={property}
                  />
                ) : (
                  ""
                )}
                {relatedListFiles ? (
                  <RelatedListFiles
                    refreshFileList={refreshFileList}
                    parent={property}
                    table="property"
                  />
                ) : (
                  ""
                )}
                 {relatedListArea ? (
                <RelatedListArea
                  refreshAreaList={modalShowArea}
                  parent={property}
                  table="lead"
                />
                ) : (
                  ""
                )}
                {relatedListHeight ? (
                <RelatedListHeight
                  refreshAreaList={modalShowHeight}
                  parent={property}
                  table="lead"
                />
                ) : (
                  ""
                )}
                {relatedListPdf &&
                  <RelatedListPDF
                    refreshFileList={refreshFileList}
                    parent={property}
                    table="property"
                  />
                }
              </Card.Body>
            </Card>
            <EmailComposer
              size="lg"
              show={modalShowEmail}
              onHide={() => setModalShowEmail(false)}
              parentid={property?.id}
              toEmail={property?.email}
              table="property"
              submitTasks={submitTasks}
            />
          </div>
        </Container>
      )}
    </div>
  );
};

export default PropertyView;
