import React, { useEffect, useState, useRef } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// import { PDFViewer } from "@react-pdf/renderer";
import { Button, Col, Row } from "react-bootstrap";
//import getSymbolFromCurrency from "currency-symbol-map";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Table from "react-bootstrap/Table";
import moment from "moment";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";

const PropertyView = ({ propertyData }) => {
  return (
    <div>
      <div style={{ ...styles.propertyInfoBox }}>
        <h2 style={{ ...styles.heading, textAlign: "center" }}>
          Property Information of {propertyData.name}
        </h2>
      </div>
      {propertyData ? (
        <div>
          <div style={styles.propertyInfoBox}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Property Name:</strong> {propertyData.name}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Code:</strong> {propertyData.code}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Email:</strong> {propertyData.email}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Phone:</strong> {propertyData.phone}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Project Name:</strong> {propertyData.projectname}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Project For:</strong> {propertyData.propertyfor}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Category:</strong> {propertyData.category}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Type:</strong> {propertyData.type}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Measure in:</strong> {propertyData.areameasure}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Total Area:</strong> {propertyData.area}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Property Cost:</strong> {propertyData.cost}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Contact Person:</strong> {propertyData.contactname}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Assigned Staff:</strong> {propertyData.ownername}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Status:</strong> {propertyData.status}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Description:</strong> {propertyData.description}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Owner Name:</strong> {propertyData.ownername}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Project Name:</strong> {propertyData.projectname}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Subvertical Type:</strong>{" "}
                  {propertyData.subverticaltype}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Type Of Client:</strong> {propertyData.typeofclient}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Vertical Type:</strong> {propertyData.verticaltype}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Area To From:</strong> {propertyData.areatofrom}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Furnished Status:</strong>{" "}
                  {propertyData.furnishedstatus}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Property Type:</strong> {propertyData.propertytype}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Vertical:</strong> {propertyData.vertical}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Possession Status:</strong>{" "}
                  {propertyData.possessionstatus}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Property Base:</strong> {propertyData.propertybase}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Transaction Type:</strong>{" "}
                  {propertyData.transactiontype}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Super Built Up Area:</strong>{" "}
                  {propertyData.superbuiltuparea}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Legal Status:</strong> {propertyData.legalstatus}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Property For:</strong> {propertyData.Propertyfor}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Video Url:</strong> {propertyData.vidurl}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Show On Web:</strong> {propertyData.showonweb}
                </p>
              </div>
            </div>
          </div>
          <p>
            <strong>Address:</strong> {propertyData.address}
          </p>
          <div style={styles.propertyInfoBox}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Street:</strong> {propertyData.street}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>City:</strong> {propertyData.city}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>State:</strong> {propertyData.state}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Pincode:</strong> {propertyData.pincode}
                </p>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p>
                <strong>Country:</strong> {propertyData.country}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>No property data available.</p>
      )}
    </div>
  );
};
const styles = {
  propertyInfoBox: {
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
  },
};

const MyDocument = () => {
  const location = useLocation();
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${propertyData.name} - pdf.pdf`);
    //.log("Completed");
  };

  const handleGoBack = () => {
    navigate(`/properties/${propertyData.id}`, { state: propertyData });
  };
  const propertyData = {
    ...location.state,
  };

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
            <Button onClick={handleDownloadPdf}> Download as PDF </Button>
          </div>
        </div>
      </center>

      <div ref={printRef}>
        <div className="p-5">
          <center>
            <h6></h6>
          </center>

          <PropertyView propertyData={propertyData} />
        </div>
      </div>
    </div>
  );
};

export default MyDocument;
