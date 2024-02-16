import React, { useState } from "react";
import {
  Button,
  Tooltip,
  OverlayTrigger,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import PdfDownload from "../PdfDownload";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation, useNavigate } from "react-router-dom";
import "../PdfBuilder/PdfBuilder.css";
import FormData from "form-data";
import axios from "axios";
import PubSub from "pubsub-js";
import * as constants from "../../constants/CONSTANT"
import moment from "moment";



const PdfBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [property, setProperty] = useState(
    location.state ? location.state : {}
  );
  const [propertyData, setpropertyData] = useState(
    location.state ? location.state : {}
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  

  function handlePDfSave(blob){
    //.log('propertyData',propertyData.propertyData, );
    var myFile = new File([blob], `${propertyData.propertyData.name}.pdf`, {lastModified: 1534584790000});
    //.log('myFile',myFile);
    const token = localStorage.getItem("token");
    var formData = new FormData();
    formData.append("image", myFile);
    formData.append(`description`, 'pdf files');
    formData.append(`fileType`, myFile);
    formData.append(`ispdf`, true);
    //.log("formdata",JSON.stringify(formData));

    axios
    .post(
      `${constants.API_BASE_URL}/api/files/${propertyData.propertyData.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
        onUploadProgress: (data) => {
          // Set the progress value to show the progress bar
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
       
      }
    )
    .then((response) => {
      //.log("response",response)
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: "Record saved successfully",
      });
    })
    .catch((error) => {
      //.log('error',error);
    });
  }

  //.log('propertyData line 27 :>> ', propertyData);
  const [editedValues, setEditedValues] = useState({
    firstpage: {
      PropertyType: propertyData.firstpage.PropertyType,
      Street: propertyData.firstpage.Street,
      City: propertyData.firstpage.City,
      proposalDate: propertyData.firstpage.proposalDate,
      imagelink: propertyData.firstpage.imagelink,
    },
    secondpage: {
      State: propertyData.secondpage.State,
      City: propertyData.secondpage.City,
      Area: propertyData.secondpage.Area,
      Population: propertyData.secondpage.Population,
      PopulationGrowth: propertyData.secondpage.PopulationGrowth,
      PopulationDensity: propertyData.secondpage.PopulationDensity,
      LiteracyRate: propertyData.secondpage.LiteracyRate,
      AnnualPerCapita: propertyData.secondpage.AnnualPerCapita,
    },

    secondpageimage: {
      imagelink: propertyData.secondpageimage.imagelink,
    },

    logo: { logo: propertyData.logo },

    thirdpage: {
      imagelink: propertyData.thirdpage.imagelink,
    },
    fourthpage: {
      ExpectedDate: propertyData.fourthpage.ExpectedDate,
      FloorPlate: propertyData.fourthpage.FloorPlate,
      Frontage: propertyData.fourthpage.Frontage,
      Location: propertyData.fourthpage.Location,
      Rental: propertyData.fourthpage.Rental,
      Tenure: propertyData.fourthpage.Tenure,
    },
    fourthpage1: {
      status: propertyData.fourthpage.status,
      Taxes: propertyData.fourthpage.Taxes,
      RentExcalation: propertyData.fourthpage.RentExcalation,
      StampDuty: propertyData.fourthpage.StampDuty,
      ElectricConnection: propertyData.fourthpage.ElectricConnection,
      MaintenanceCharges: propertyData.fourthpage.MaintenanceCharges,
      NeighbouringBrands: propertyData.fourthpage.NeighbouringBrands,
    },
    fifthpage: {
      imagelink: propertyData.fifthpage.imagelink,
      vaastu: propertyData.fifthpage.vaastu,
      ROWater: propertyData.fifthpage.ROWater,
      HighSpeed: propertyData.fifthpage.HighSpeed,
      wheelChair: propertyData.fifthpage.wheelChair,
      maintenanceStaff: propertyData.fifthpage.maintenanceStaff,
      powerBackup: propertyData.fifthpage.powerBackup,
      DedicatedParking: propertyData.fifthpage.DedicatedParking,
    },
 // --Actual view---
    sixthpage: {
      imagelink1: propertyData.sixthpage.imagelink1,
      imagelink2: propertyData.sixthpage.imagelink2,
    },
    seventhpage: {
      imagelink: propertyData.seventhpage.imagelink,
    },
    // Eighth Page
    eightpage: {
      imagelink: propertyData.eightpage.imagelink,
    },
    // Ninth Page
    ninthpage: {
      imagelink1: propertyData.ninthpage.imagelink1,
      imagelink2: propertyData.ninthpage.imagelink2,
    },

    // Tenth Page
    tenthpage: {
      imagelink1: propertyData.tenthpage.imagelink1,
      imagelink2: propertyData.tenthpage.imagelink2,
    },

    // Eleventh Page
    eleventhPage: {
      imagelink1: propertyData.eleventhPage.imagelink1,
      imagelink2: propertyData.eleventhPage.imagelink2,
    },
 // --Brand Mapping---
    // Twelfth Page
    twelvethPage: {
      imagelink: propertyData.twelvethPage.imagelink,
    },

    // Thirteenth Page
    thirteenthPage: {
      imagelink: propertyData.thirteenthPage.imagelink,
    },

    // Fourteenth Page
    fourteenthPage: {
      imagelink: propertyData.fourteenthPage.imagelink,
    },

    // Fifteenth Page
    fiftenthPage: {
      imagelink: propertyData.fiftenthPage.imagelink,
    },

    // Sixteenth Page
    sixteenthPage: {
      imagelink: propertyData.sixteenthPage.imagelink,
    },

    // Seventeenth Page
    seventeenthPage: {
      imagelink1: propertyData.seventeenthPage.imagelink1,
      imagelink2: propertyData.seventeenthPage.imagelink2,
      imagelink3: propertyData.seventeenthPage.imagelink3,
    },

    // Eighteenth Page
    eighteenthPage: {
      imagelink1: propertyData.eighteenthPage.imagelink1,
      imagelink2: propertyData.eighteenthPage.imagelink2,
      imagelink3: propertyData.eighteenthPage.imagelink3,
    },

    // Nineteenth Page
    nineteenthpage: {
      imagelink1: propertyData.nineteenthpage.imagelink1,
      imagelink2: propertyData.nineteenthpage.imagelink2,
      imagelink3: propertyData.nineteenthpage.imagelink3,
    },

    // Twentyth Page
    twentythPage: {
      imagelink1: propertyData.twentythPage.imagelink1,
      imagelink2: propertyData.twentythPage.imagelink2,
      imagelink3: propertyData.twentythPage.imagelink3,
    },

    // Twenty-First Page
    twentyfirstPage: {
      imagelink1: propertyData.twentyfirstPage.imagelink1,
      imagelink2: propertyData.twentyfirstPage.imagelink2,
      imagelink3: propertyData.twentyfirstPage.imagelink3,
    },

    // Twenty-Second Page
    twentysecondPage: {
      imagelink1: propertyData.twentysecondPage.imagelink1,
      imagelink2: propertyData.twentysecondPage.imagelink2,
      imagelink3: propertyData.twentysecondPage.imagelink3,
    },

    // Twenty-Third Page
    twentythirdPage: {
      imagelink1: propertyData.twentythirdPage.imagelink1,
      imagelink2: propertyData.twentythirdPage.imagelink2,
      imagelink3: propertyData.twentythirdPage.imagelink3,
    },

    // Twenty-Fourth Page
    twentyfourthPage: {
      imagelink1: propertyData.twentyfourthPage.imagelink1,
      imagelink2: propertyData.twentyfourthPage.imagelink2,
      imagelink3: propertyData.twentyfourthPage.imagelink3,
    },

    // Twenty-Fifth Page

    twentyfifthpage: {
      name: propertyData.twentyfifthpage.name,
      mobile: propertyData.twentyfifthpage.mobile,
      name1: propertyData.twentyfifthpage.name1,
      mobile1: propertyData.twentyfifthpage.mobile1,
      Email: propertyData.twentyfifthpage.Email,
      Website: propertyData.twentyfifthpage.Website,
      Address: propertyData.twentyfifthpage.Address,
      Disclaimer: propertyData.twentyfifthpage.Disclaimer,
    },
  });

  

  const [selectedPages, setSelectedPages] = useState({
    firstpage: true,
    secondpage: true,
    thirdpage: true,
    fourthpage: true,
    fifthpage: true,
    sixthpage: true,
    seventhpage: true,
    eightpage: true,
    ninthpage: true,
    tenthpage: true,
    twelvethPage: true,
    eleventhPage: true,
    thirteenthPage: true,
    fourteenthPage: true,
    fiftenthPage: true,
    sixteenthPage: true,
    seventeenthPage: true,
    eighteenthPage: true,
    nineteenthpage: true,
    twentythPage: true,
    twentyfirstPage: true,
    twentysecondPage: true,
    twentythirdPage: true,
    twentyfourthPage: true,
    twentyfifthpage: true,
    twentysixthpage: true,
  });

  const handlePageCheckboxChange = (pageName) => {
    setSelectedPages((prevSelectedPages) => ({
      ...prevSelectedPages,
      [pageName]: !prevSelectedPages[pageName],
    }));
  };
  const initialEditStates = {
    editModeProposedOption: false,
    editModeFor: false,
    editModeProposalDate: false,
    editModeImage: false,
    editSecondImage: false,
    editThirdImage: false,
    editModernImage: false,
    editPropertyTable1: false,
    editPropertyTable2: false,
    editVastu: false,
    editRoWater: false,
    editHighSpeed: false,
    editWheelChair: false,
    editMaintance: false,
    editPowerBackup: false,
    editDedicated: false,
    editActualImage: false,
    editActualSecondImage: false,
    editActual3Image: false,
    editActual4Image: false,
    editActual5Image: false,
    editActual6Image: false,
    editActual7Image: false,
    editActual8Image: false,
    editActual9Image: false,
    editActual10Image: false,
    editActual11Image: false,
    editActual12Image: false,
    editActual13Image: false,
    editActual14Image: false,
    editActual15Image: false,
    editActual16Image: false,
    editActual17Image: false,
    editActual18Image: false,
    editActual19Image: false,
    editActual20Image: false,
    editActual21Image: false,
    editActual22Image: false,
    editActual23Image: false,
    editActual24Image: false,
    editActual25Image: false,
    editActual26Image: false,
    editActual27Image: false,
    editActual28Image: false,
    editActual29Image: false,
    editActual30Image: false,
    editActual31Image: false,
    editActual32Image: false,
    editActual33Image: false,
    editActual34Image: false,
    editActual35Image: false,
    editActual36Image: false,
    editActual37Image: false,
    editActual38Image: false,
    editActual39Image: false,
  };

  const [editStates, setEditStates] = useState(initialEditStates);
  //.log("editStates *==>", editStates);

  // Function to toggle the state of a specific property
  const toggleEditState = (key) => {
    setEditStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleGoBack = () => {
    navigate(`/properties/${propertyData.propertyData.id}`, { state: propertyData.propertyData });
  };

  const handleInputChange = (event) => {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  
        if (!allowedExtensions.includes(fileExtension)) {
          setErrorMessage("Select Images Only");
            setError(true);
          fileInput.value = '';
        } else {
          setErrorMessage("");
            setError(false);
           const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const newImage = reader.result;
              setEditedValues((prevValues) => ({
                ...prevValues,
                [name]: {
                  ...prevValues[name],
                  [data]: newImage,
                },
              }));
            };
    
            reader.readAsDataURL(file);
    
            //To Display the image after editing
            const toggleEditMode = (editMode) => {
              setEditStates((prevEditStates) => ({
                ...prevEditStates,
                [editMode]: !prevEditStates[editMode],
              }));
            };
    
            const toggleEditModeIfTrue = (keys) => {
              for (const key of keys) {
                if (editStates[key]) {
                  toggleEditMode(key);
                  break;
                }
              }
            };
    
            const modeKeys = [
              "editModeImage",
              "editSecondImage",
              "editThirdImage",
              "editModernImage",
              "editActualImage",
              "editActualSecondImage",
              "editActual3Image",
              "editActual4Image",
              "editActual5Image",
              "editActual6Image",
              "editActual7Image",
              "editActual8Image",
              "editActual9Image",
              "editActual10Image",
              "editActual11Image",
              "editActual12Image",
              "editActual13Image",
              "editActual14Image",
              "editActual15Image",
              "editActual16Image",
              "editActual17Image",
              "editActual18Image",
              "editActual19Image",
              "editActual20Image",
              "editActual21Image",
              "editActual22Image",
              "editActual23Image",
              "editActual24Image",
              "editActual25Image",
              "editActual26Image",
              "editActual27Image",
              "editActual28Image",
              "editActual29Image",
              "editActual30Image",
              "editActual31Image",
              "editActual32Image",
              "editActual33Image",
              "editActual34Image",
              "editActual35Image",
              "editActual36Image",
              "editActual37Image",
              "editActual38Image",
              "editActual39Image",
            ];
    
            toggleEditModeIfTrue(modeKeys);
          }
        }
      
    const { type } = event.target;
    const name = event.target.name;
    const data = event.target.getAttribute("data");

    if (type !== "file") {
      // Handle text input
      const value = event.target.value;

      setEditedValues((prevValues) => ({
        ...prevValues,
        [name]: {
          ...prevValues[name],
          [data]: value,
        },
      }));
    }
  };
  }
  //second page

  const handleInputChangeSecondPage = (fieldName, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      secondpage: {
        ...prevValues.secondpage,
        [fieldName]: value,
      },
    }));
  };

  //Fourth Page
  const handleInputChangeFourthPage = (fieldName, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      fourthpage: {
        ...prevValues.fourthpage,
        [fieldName]: value,
      },
    }));
  };
  const handleInputChangeFourthPage1 = (fieldName, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      fourthpage1: {
        ...prevValues.fourthpage1,
        [fieldName]: value,
      },
    }));
  };
  //.log('editedValues.firstpage.imagelink', editedValues.firstpage.imagelink)


  return (
    <div>
      <center>
        <div
          className="d-flex justify-content-between"
          style={{ width: "95%" }}
        >
          <div className="m-2">
            <Button onClick={handleGoBack}> Back </Button>
          </div>

          <div className="m-2">
            {/* <OverlayTrigger
              placement="top"
              overlay={<Tooltip className="my-tooltip">PDF</Tooltip>}
            >*/}
            <PDFDownloadLink
              document={
                <PdfDownload
                  reportBuilder={{ ...propertyData, ...editedValues }}
                  table={property}
                  selectedPages={selectedPages}
                />
              }
              fileName= {`${propertyData.propertyData.name} - pdf - ${moment().format('DD-MM-YYYY:HH:MM:SS')}.pdf`}
            >
              {({ loading,blob }) =>
                loading ? (
                  <Button disabled>Loading Document...</Button>
                ) : (
                  <Button onClick={ () => handlePDfSave(blob)}> Download</Button>
                )
              }
            </PDFDownloadLink>
            {/* </OverlayTrigger> */}
          </div>
        </div>
      </center>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.firstpage}
            onChange={() => handlePageCheckboxChange("firstpage")}
          />
        </label>
      </div>

      <div className="size">
        <div className="page-container">
          <div className="left-section">
            <div className="centered-text" style={{ marginBottom: "5px" }}>
              Proposed Option
            </div>
            <div className="centered-text" style={{ marginLeft: "190px" }}>
              For
            </div>
            <div
              onDoubleClick={() => toggleEditState("editModeProposedOption")}
            >
              {editStates.editModeProposedOption ? (
                <>
                <input
                  name="firstpage"
                  data="PropertyType"
                  type="text"
                  value={editedValues.firstpage.PropertyType}
                  onChange={handleInputChange}
                  style={{ marginLeft: "150px", marginTop: "10px" }}
                />
               
                </>
                
              ) : (
                <div className="centered-text" style={{ marginLeft: "20px" }}>
                  {editedValues.firstpage.PropertyType}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editModeFor")}>
              {editStates.editModeFor ? (
                <div>
                  <input
                    name="firstpage"
                    data="Street"
                    type="text"
                    value={editedValues.firstpage.Street}
                    onChange={handleInputChange}
                    style={{ marginLeft: "60px", marginTop: "10px" }}
                  />
                  <input
                    name="firstpage"
                    data="City"
                    type="text"
                    value={editedValues.firstpage.City}
                    onChange={handleInputChange}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              ) : (
                <div
                  className="centered-text"
                  style={{
                    fontSize: "16px",
                    marginLeft: "85px",
                    marginTop: "20px",
                    marginBottom: "3px",
                  }}
                >{`${editedValues.firstpage.Street}, ${editedValues.firstpage.City}`}</div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editModeProposalDate")}>
              {editStates.editModeProposalDate ? (
                <input
                  name="firstpage"
                  data="proposalDate"
                  type="text"
                  value={editedValues.firstpage.proposalDate}
                  onChange={handleInputChange}
                  style={{ marginLeft: "150px", marginTop: "15px" }}
                />
              ) : (
                <div
                  className="centered-text"
                  style={{
                    fontSize: "16px",
                    marginLeft: "109px",
                    marginBottom: "5px",
                  }}
                >
                  {editedValues.firstpage.proposalDate}
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editModeImage")}>
              {editStates.editModeImage ? (
                <>
                <input
                  name="firstpage"
                  data="imagelink"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                  style={{ marginTop: "155px" }}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="image"
                    src={editedValues.firstpage.imagelink}
                    // src={
                    //   editedValues.firstpage.imagelink.includes("/")
                    //     ? editedValues.firstpage.imagelink
                    //     : URL.createObjectURL(editedValues.firstpage.imagelink)
                    // }
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bottom-section">
            <div style={{ fontSize: "12px", color: "white" }}>
              By Sthapatya Leasing & Consultant
            </div>
          </div>
          <div
            className="bottom-section1"
            style={{
              fontSize: "12px",
              marginBottom: "-45px",
              color: "white",
            }}
          >
            {editedValues.firstpage.proposalDate}
          </div>
        </div>
      </div>

      {/*--------------------------- City  Overview Page----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.secondpage}
            onChange={() => handlePageCheckboxChange("secondpage")}
          />
        </label>
      </div>

      <div className="size">
        <div className="page-container">
          <div
            style={{
              backgroundColor: "#B7A292",
              height: "377px",
              width: "377px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#132925",
                  fontSize: 34,
                  fontWeight: "bold",
                  marginLeft: "25px",
                  marginTop: "20px",
                }}
              >
                City Overview
              </div>
              <div onDoubleClick={() => toggleEditState("editModeSecondPage")}>
                {editStates.editModeSecondPage ? (
                  <table className="styled-table1">
                    <thead>
                      <tr>
                        <th colSpan="2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(editedValues.secondpage).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  handleInputChangeSecondPage(
                                    key,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th colSpan="2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(editedValues.secondpage).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div onDoubleClick={() => toggleEditState("editSecondImage")}>
            {editStates.editSecondImage ? (
              <>
              <input
                name="secondpageimage"
                data="imagelink"
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleInputChange}
                 style={{ marginLeft: "140px", marginTop: "150px" }}
              />
              {errorMessage && (
                <div className="text-danger">
                  <b>{errorMessage}</b>
                </div>
              )}
              </>
            ) : (
              <div>
                <img
                  className="second-image"
                  src={editedValues.secondpageimage.imagelink}
                  alt="Property"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/*--------------------------- Google  View Page----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.thirdpage}
            onChange={() => handlePageCheckboxChange("thirdpage")}
          />
        </label>
      </div>

      <div className="size">
        <div className="page-container">
          <div
            style={{
              height: "80px",
              width: "100%",
              backgroundColor: "#B7A292",
            }}
          >
            <div
              style={{
                color: "black",
                backgroundColor: "#B7A292",
                fontSize: 42,
                fontWeight: "bold",
                marginLeft: "195px",
                marginTop: "10px",
              }}
            >
              Google View
            </div>
            <div style={{ marginTop: "-60px", marginLeft: "600px" }}>
              <img
                className="logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>
          <div style={{ marginLeft: "-640px", marginTop: "100px" }}>
            <div onDoubleClick={() => toggleEditState("editThirdImage")}>
              {editStates.editThirdImage ? (
                <>
                <input
                  name="thirdpage"
                  data="imagelink"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}    
                 style={{ marginLeft: "240px", marginTop: "100px" }}
                />
                 {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="third-image"
                    src={editedValues.thirdpage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*--------------------------- Property  Images Page----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.fourthpage}
            onChange={() => handlePageCheckboxChange("fourthpage")}
          />
        </label>
      </div>

      <div className="size">
        <div className="page-container">
          <div
            style={{
              height: "70px",
              width: "100%",
              backgroundColor: "#B7A292",
            }}
          >
            <div
              style={{
                color: "black",
                backgroundColor: "#B7A292",
                fontSize: 42,
                fontWeight: "bold",
                marginLeft: "195px",
                marginTop: "5px",
              }}
            >
              Property Images
            </div>
            <div style={{ marginTop: "-60px", marginLeft: "600px" }}>
              <img
                className="logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#B7A292",
              height: "282px",
              width: "321px",
              marginTop: "82px",
              marginLeft: "-695px",
            }}
          >
            <div>
              <div onDoubleClick={() => toggleEditState("editPropertyTable1")}>
                {editStates.editPropertyTable1 ? (
                  <table className="properties-table1">
                    <thead>
                      <tr>
                        <th>Parameters</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(editedValues.fourthpage).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  handleInputChangeFourthPage(
                                    key,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="properties-table">
                    <thead>
                      <tr>
                        <th>Parameters</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(editedValues.fourthpage).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#B7A292",
              height: "282px",
              width: "362px",
              marginTop: "82px",
              marginLeft: "6px",
            }}
          >
            <div>
              <div onDoubleClick={() => toggleEditState("editPropertyTable2")}>
                {editStates.editPropertyTable2 ? (
                  <table className="properties-table2">
                    <thead>
                      <tr>
                        <th>Parameters</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(editedValues.fourthpage1).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  handleInputChangeFourthPage1(
                                    key,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="properties-tables">
                    <thead>
                      <tr>
                        <th>Parameters</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(editedValues.fourthpage1).map(
                        ([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*--------------------------- Modern  Facilities Page----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.fifthpage}
            onChange={() => handlePageCheckboxChange("fifthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div
            style={{
              backgroundColor: "#B7A292",
              height: "377px",
              width: "320px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#132925",
                  fontSize: 34,
                  fontWeight: "bold",
                  marginLeft: "15px",
                  marginTop: "20px",
                }}
              >
                Modern Facilities
              </div>
              <div onDoubleClick={() => toggleEditState("editModernImage")}>
                {editStates.editModernImage ? (
                  <>
                  <input
                    name="fifthpage"
                    data="imagelink"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleInputChange}                   
                     style={{ marginLeft: "95px", marginTop: "120px" }}
                  />
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
                ) : (
                  <div>
                    <img
                      className="modern-image"
                      src={editedValues.fifthpage.imagelink}
                      alt="Property"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rigth-section">
            <div onDoubleClick={() => toggleEditState("editVastu")}>
              {editStates.editVastu ? (
                <input
                  name="fifthpage"
                  data="vaastu"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.vaastu}
                  onChange={handleInputChange}
                  style={{ marginTop: "50px" }}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "50px" }}>
                  {`\u2022`} {editedValues.fifthpage.vaastu}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editRoWater")}>
              {editStates.editRoWater ? (
                <input
                  name="fifthpage"
                  data="ROWater"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.ROWater}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "10px" }}>
                  • {editedValues.fifthpage.ROWater}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editHighSpeed")}>
              {editStates.editHighSpeed ? (
                <input
                  name="fifthpage"
                  data="HighSpeed"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.HighSpeed}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "10px" }}>
                  • {editedValues.fifthpage.HighSpeed}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editWheelChair")}>
              {editStates.editWheelChair ? (
                <input
                  name="fifthpage"
                  data="wheelChair"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.wheelChair}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "10px" }}>
                  • {editedValues.fifthpage.wheelChair}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editMaintance")}>
              {editStates.editMaintance ? (
                <input
                  name="fifthpage"
                  data="maintenanceStaff"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.maintenanceStaff}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "10px" }}>
                  • {editedValues.fifthpage.maintenanceStaff}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editPowerBackup")}>
              {editStates.editPowerBackup ? (
                <input
                  name="fifthpage"
                  data="powerBackup"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.powerBackup}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "10px" }}>
                  • {editedValues.fifthpage.powerBackup}
                </div>
              )}
            </div>

            <div onDoubleClick={() => toggleEditState("editDedicated")}>
              {editStates.editDedicated ? (
                <input
                  name="fifthpage"
                  data="DedicatedParking"
                  className="modern-edit"
                  type="text"
                  value={editedValues.fifthpage.DedicatedParking}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="modern-text" style={{ marginTop: "10px" }}>
                  • {editedValues.fifthpage.DedicatedParking}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*--------------------------- Actual  View Page----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.sixthpage}
            onChange={() => handlePageCheckboxChange("sixthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="actual-view">Actual View</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActualImage")}>
              {editStates.editActualImage ? (
                <>
                <input
                  name="sixthpage"
                  data="imagelink1"
                  className="actual-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                /> {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image1"
                    src={editedValues.sixthpage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActualSecondImage")}>
              {editStates.editActualSecondImage ? (
                <>
                <input
                  name="sixthpage"
                  data="imagelink2"
                  className="actual-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image2"
                    src={editedValues.sixthpage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.seventhpage}
            onChange={() => handlePageCheckboxChange("seventhpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="actual-view">Actual View</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual3Image")}>
              {editStates.editActual3Image ? (
                <>
                <input
                  name="seventhpage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image3"
                    src={editedValues.seventhpage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.eightpage}
            onChange={() => handlePageCheckboxChange("eightpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="actual-view">Actual View</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual10Image")}>
              {editStates.editActual10Image ? (
                <>
                <input
                  name="eightpage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image3"
                    src={editedValues.eightpage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.ninthpage}
            onChange={() => handlePageCheckboxChange("ninthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="actual-view">Actual View</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual4Image")}>
              {editStates.editActual4Image ? (
                <>
                <input
                  name="ninthpage"
                  data="imagelink1"
                  className="actual-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image1"
                    src={editedValues.ninthpage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual5Image")}>
              {editStates.editActual5Image ? (
                <>
                <input
                  name="ninthpage"
                  data="imagelink2"
                  className="actual-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image2"
                    src={editedValues.ninthpage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.tenthpage}
            onChange={() => handlePageCheckboxChange("tenthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="actual-view">Actual View</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual6Image")}>
              {editStates.editActual6Image ? (
                <>
                <input
                  name="tenthpage"
                  data="imagelink1"
                  className="actual-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image1"
                    src={editedValues.tenthpage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual7Image")}>
              {editStates.editActual7Image ? (
                <>
                <input
                  name="tenthpage"
                  data="imagelink2"
                  className="actual-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="actual-image2"
                    src={editedValues.tenthpage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.eleventhPage}
            onChange={() => handlePageCheckboxChange("eleventhPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="actual-view">Actual View</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual8Image")}>
              {editStates.editActual8Image ? (
                <>
                <input
                  name="eleventhPage"
                  data="imagelink1"
                  className="actual-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="actual-image1"
                    src={editedValues.eleventhPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual9Image")}>
              {editStates.editActual9Image ? (
                <>
                <input
                  name="eleventhPage"
                  data="imagelink2"
                  className="actual-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange} />
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="actual-image2"
                    src={editedValues.eleventhPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*--------------------------- Brand  Mapping Page----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twelvethPage}
            onChange={() => handlePageCheckboxChange("twelvethPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="brand-mapping">Brand Mapping</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual11Image")}>
              {editStates.editActual11Image ? (
                <>
                <input
                  name="twelvethPage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange} />
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="brand-mapping-image"
                    src={editedValues.twelvethPage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.thirteenthPage}
            onChange={() => handlePageCheckboxChange("thirteenthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container2">
          <div>
            <div className="brand-mapping1">Floor Plan</div>
            <div className="brand-mapping_basement">Basement Floor</div>

            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual12Image")}>
              {editStates.editActual12Image ? (
                <>
                <input
                  name="thirteenthPage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="brand-mapping-image3"
                    src={editedValues.thirteenthPage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.fourteenthPage}
            onChange={() => handlePageCheckboxChange("fourteenthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container2">
          <div>
            <div className="brand-mapping1">Floor Plan</div>
            <div className="brand-mapping_basement">Ground Floor</div>

            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual13Image")}>
              {editStates.editActual13Image ? (
                <>
                <input
                  name="fourteenthPage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange} />
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="brand-mapping-image3"
                    src={editedValues.fourteenthPage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.fiftenthPage}
            onChange={() => handlePageCheckboxChange("fiftenthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container2">
          <div>
            <div className="brand-mapping1">Floor Plan</div>
            <div className="brand-mapping_basement">1st Floor</div>

            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual14Image")}>
              {editStates.editActual14Image ? (
                <>
                <input
                  name="fiftenthPage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange} />
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="brand-mapping-image3"
                    src={editedValues.fiftenthPage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.sixteenthPage}
            onChange={() => handlePageCheckboxChange("sixteenthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container2">
          <div>
            <div>
              <img
                className="brand-mapping-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual15Image")}>
              {editStates.editActual15Image ? (
                <input
                  name="sixteenthPage"
                  data="imagelink"
                  className="actual-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}                />
              ) : (
                <div>
                  <img
                    className="brand-mapping-image3"
                    src={editedValues.sixteenthPage.imagelink}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      {/*--------------------------- Vicinity Images Pages----------------------------- */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.seventeenthPage}
            onChange={() => handlePageCheckboxChange("seventeenthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual16Image")}>
              {editStates.editActual16Image ? (
                <>
                <input
                  name="seventeenthPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.seventeenthPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual17Image")}>
              {editStates.editActual17Image ? (
                <>
                <input
                  name="seventeenthPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.seventeenthPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual18Image")}>
              {editStates.editActual18Image ? (
                <>
                <input
                  name="seventeenthPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.seventeenthPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 2 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.eighteenthPage}
            onChange={() => handlePageCheckboxChange("eighteenthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual19Image")}>
              {editStates.editActual19Image ? (
                <>
                <input
                  name="eighteenthPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.eighteenthPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual20Image")}>
              {editStates.editActual20Image ? (
                <>
                <input
                  name="eighteenthPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.eighteenthPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual21Image")}>
              {editStates.editActual21Image ? (
                <>
                <input
                  name="eighteenthPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.eighteenthPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 3 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.nineteenthpage}
            onChange={() => handlePageCheckboxChange("nineteenthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual22Image")}>
              {editStates.editActual22Image ? (
                <>
                <input
                  name="nineteenthpage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.nineteenthpage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual23Image")}>
              {editStates.editActual23Image ? (
                <>
                <input
                  name="nineteenthpage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.nineteenthpage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual24Image")}>
              {editStates.editActual24Image ? (
                 <>
                <input
                  name="nineteenthpage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.nineteenthpage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 4 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentythPage}
            onChange={() => handlePageCheckboxChange("twentythPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual25Image")}>
              {editStates.editActual25Image ? (
                <>
                <input
                  name="twentythPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.twentythPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual26Image")}>
              {editStates.editActual26Image ? (
                <>
                <input
                  name="twentythPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.twentythPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual27Image")}>
              {editStates.editActual27Image ? (
                <>
                <input
                  name="twentythPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.twentythPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 5 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentyfirstPage}
            onChange={() => handlePageCheckboxChange("twentyfirstPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual28Image")}>
              {editStates.editActual28Image ? (
                <>
                <input
                  name="twentyfirstPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.twentyfirstPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual29Image")}>
              {editStates.editActual29Image ? (
                <>
                <input
                  name="twentyfirstPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  onChange={handleInputChange}
                />
                 {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.twentyfirstPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual30Image")}>
              {editStates.editActual30Image ? (
                <>
                <input
                  name="twentyfirstPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.twentyfirstPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 6 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentysecondPage}
            onChange={() => handlePageCheckboxChange("twentysecondPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual31Image")}>
              {editStates.editActual31Image ? (
                <>
                <input
                  name="twentysecondPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.twentysecondPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual32Image")}>
              {editStates.editActual32Image ? (
                <>
                <input
                  name="twentysecondPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.twentysecondPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual33Image")}>
              {editStates.editActual33Image ? (
                <>
                <input
                  name="twentysecondPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.twentysecondPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 7 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentythirdPage}
            onChange={() => handlePageCheckboxChange("twentythirdPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual34Image")}>
              {editStates.editActual34Image ? (
                <>
                <input
                  name="twentythirdPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.twentythirdPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual35Image")}>
              {editStates.editActual35Image ? (
                <>
                <input
                  name="twentythirdPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.twentythirdPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual36Image")}>
              {editStates.editActual36Image ? (
                <>
                <input
                  name="twentythirdPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  onChange={handleInputChange}
                />
                {errorMessage && (
                  <div className="text-danger">
                    <b>{errorMessage}</b>
                  </div>
                )}
                </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.twentythirdPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* page 8 */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentyfourthPage}
            onChange={() => handlePageCheckboxChange("twentyfourthPage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container1">
          <div>
            <div className="vicinity-view">Vicinity Images</div>
            <div>
              <img
                className="actual-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>

          <div>
            <div onDoubleClick={() => toggleEditState("editActual37Image")}>
              {editStates.editActual37Image ? (
                 <>
                <input
                  name="twentyfourthPage"
                  data="imagelink1"
                  className="vicinity-image1input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image1"
                    src={editedValues.twentyfourthPage.imagelink1}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual38Image")}>
              {editStates.editActual38Image ? (
                <>
                <input
                  name="twentyfourthPage"
                  data="imagelink2"
                  className="vicinity-image2input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image2"
                    src={editedValues.twentyfourthPage.imagelink2}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div onDoubleClick={() => toggleEditState("editActual39Image")}>
              {editStates.editActual39Image ? (
                <>
                <input
                  name="twentyfourthPage"
                  data="imagelink3"
                  className="vicinity-image3input"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleInputChange}/>
                  {errorMessage && (
                    <div className="text-danger">
                      <b>{errorMessage}</b>
                    </div>
                  )}
                  </>
              ) : (
                <div>
                  <img
                    className="vicinity-image3"
                    src={editedValues.twentyfourthPage.imagelink3}
                    alt="Property"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentyfifthpage}
            onChange={() => handlePageCheckboxChange("twentyfifthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div>
            <div className="contact-details">Contact Details</div>
            <div>
              <img
                className="contact-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>

            <div className="contact-names">
              <div style={{ marginLeft: "15px" }}>
                <p style={{ fontSize: "15px" }}>
                  {editedValues.twentyfifthpage.name}
                  <br />
                  Mobile : {editedValues.twentyfifthpage.mobile}
                </p>
                <p style={{ fontSize: "15px" }}>
                  {editedValues.twentyfifthpage.name1}
                  <br />
                  Mobile : {editedValues.twentyfifthpage.mobile1}
                </p>
                <span style={{ fontSize: "12px" }}>
                  Email : {editedValues.twentyfifthpage.Email}
                  <br />
                </span>

                <span style={{ fontSize: "12px" }}>
                  Website :{" "}
                  <a
                    href={editedValues.twentyfifthpage.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {editedValues.twentyfifthpage.Website}
                  </a>
                </span>
              </div>
              <br></br>
              <p style={{ fontSize: "10px", marginTop: "-15px" }}>
                <span style={{ fontSize: 12, fontWeight: "bold" }}>
                  Our Address -
                </span>{" "}
                {editedValues.twentyfifthpage.Address}
              </p>
              <br />

              <p
                style={{
                  fontSize: "10px",
                  marginTop: "-35px",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <span
                  style={{ fontSize: 12, fontWeight: "bold", color: "#9A6237" }}
                >
                  {" "}
                  Disclaimer:
                </span>{" "}
                {editedValues.twentyfifthpage.Disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="size">
        <div className="page-container">
          <div>
            <div className="contact-details">Contact Details</div>
            <div>
              <img
                className="contact-logo"
                src={editedValues.logo.logo}
                alt="Property"
              />
            </div>
          </div>
          <div>
            <div className="contact-names" style={{ marginTop: "95px" }}>
              {editedValues.twentyfifthpage.name}
            </div>
            <div className="contact-names">
              Mobile : {editedValues.twentyfifthpage.mobile}
            </div>
            <div className="contact-names" style={{ marginTop: "6px" }}>
              {editedValues.twentyfifthpage.name1}
            </div>
            <div className="contact-names">
              Mobile : {editedValues.twentyfifthpage.mobile1}
            </div>

            <div className="to-contact" style={{ marginTop: "16px" }}>
              Email : {editedValues.twentyfifthpage.Email}
            </div>
            <div className="to-contact">
              Website :{" "}
              <a
                href={editedValues.twentyfifthpage.Website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {editedValues.twentyfifthpage.Website}
              </a>
            </div>
          </div>

          <div>
            <div className="our-address">
              <span style={{ fontSize: 12, fontWeight: "bold" }}>
                Our Address -
              </span>{" "}
              {editedValues.twentyfifthpage.Address}
            </div>
          </div>

          <div className="disclamier">
            <div className="disclamier1">
              <span
                style={{ fontSize: 12, fontWeight: "bold", color: "#9A6237" }}
              >
                {" "}
                Disclaimer:
              </span>{" "}
              {editedValues.twentyfifthpage.Disclaimer}
            </div>
          </div>
        </div>
      </div> */}

      <div>
        <label>
          <input
            className="check-box"
            type="checkbox"
            checked={selectedPages.twentysixthpage}
            onChange={() => handlePageCheckboxChange("twentysixthpage")}
          />
        </label>
      </div>
      <div className="size">
        <div className="page-container">
          <div className="thankyou">Thank You</div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default PdfBuilder;
