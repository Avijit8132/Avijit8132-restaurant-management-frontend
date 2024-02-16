import React from "react";
import {
  Document,
  Text,
  Link,
  View,
  Page,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
//import Data from "./Data";

const styles = StyleSheet.create({
  body: {
    // backgroundColor: '#07575B',
    backgroundColor: "#132925",
    display: "none",
  },
  size: {
    height: 320,
    width: 620,
  },

  // title: {
  //   fontSize: 24,
  //   textAlign: "center",
  // },
  // text: {
  //   margin: 12,
  //   fontSize: 14,
  //   textAlign: "justify",
  //   fontFamily: "Times-Roman",
  //   display: "flex",
  //   flexDirection: "column",
  // },
  image: {
    // marginVertical:15,
    // marginHorizontal:100,
    height: "100%",
    width: "100%", 
    objectFit: "cover",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    textAlign: "center",
    color: "grey",
  },
  centeredText: {
    color: "white",
    fontSize: 28,
    lineHeight: 1.5,
    display: "flex",
  },
  twoColumnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 1,
    // paddingVertical: 1,
  },

  column: {
    // backgroundColor:'#FFF59D',
    backgroundColor: "#B7A292",
    // backgroundColor:'white',
    //marginVertical: 5,
  },

  columnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#A27C4B",
    borderBottomWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  columnRowText: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    color: "black",
    fontSize: 10,
  },

  details: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    marginLeft: 90,
  },
  cityOverview: {
    fontSize: 28,
    lineHeight: 1.5,
    display: "flex",
    color: "#132925",
    marginLeft: 5,
    marginTop: 5,
  },
  cityOverviewImage: {
    height: 260,
    marginTop: 20,
    marginBottom: 20,
    width:  240,
    marginLeft:5,
    marginRight:5,
  },

  dataBox: {
    border: "0.6pt solid #A27C4B",
    borderRadius: 0.5,
    // marginVertical: 5,
  },
  googleView: {
    color: "black",
    fontSize: 34,
    lineHeight: 1.5,
    display: "flex",
    marginLeft: 180,
  },
  logoImage: {
    height: 42,
    width: 110,
    marginRight: 10,
    marginBottom: 5,
    marginLeft: 220,
  },
  googleImage: {
    height: 230,
    width: 550,
    marginTop: 10,
    marginBottom: 10,
    //   marginLeft: 20,
    //   marginRight: 20
  },

  detailsProperty: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    // marginLeft:90
  },

  propertyColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#A27C4B",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  propertyColumnRowText: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    color: "black",
    fontSize: 8,
  },
  propertyRow1Colour: {
    backgroundColor: "#C8CABE",
  },
  propertyRow2Colour: {
    backgroundColor: "#F7F7F7",
  },
  facilityPoint: {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 40,
    marginLeft: 45,
    marginTop: 6,
    fontSize: 16,
  },
  logoActualImage: {
    height: 42,
    width: 80,
    marginTop: -43,
    marginRight: 10,
    //  marginBottom:5,
    marginLeft: 537,
  },

  actualViewImage: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 20,
    marginBottom: 10,
    height: 240,
  },
  actualView3Images: {
    marginTop: 27,
    marginLeft: 10,
    marginBottom: 10,
    height: 235,
    width: 295,
  },
  logoActualView3Image: {
    height: 42,
    width: 80,
    marginTop: -37,
    marginRight: 10,
    //  marginBottom:5,
    marginLeft: 537,
  },
  vicinityColour: {
    backgroundColor: "#FBE9E7",
    display: "none",
  },
  vicinityView3Images: {
    marginTop: 27,
    marginLeft: 30,
    marginBottom: 10,
    height: 180,
    width: 150,
  },
  logoVicinityView3Image: {
    height: 42,
    width: 80,
    marginTop: -37,
    marginRight: 10,
    //  marginBottom:5,
    marginLeft: 515,
  },
  brandMappingImages: {
    marginTop: 18,
    marginLeft: 60,
    marginBottom: 10,
    height: 240,
    width: 490,
  },
  logoBrandMappingImages: {
    height: 42,
    width: 80,
    marginTop: -54,
    marginRight: 10,
    //  marginBottom:5,
    marginLeft: 534,
  },
  floorPlanBackgroundColour: {
    backgroundColor: "#C6B397",
    display: "none",
  },
  floorPlanImages: {
    marginTop: -45,
    marginLeft: 190,
    marginBottom: 5,
    height: 308,
    width: 260,
  },
  logoFloorPlanImages: {
    height: 42,
    width: 80,
    marginTop: -53,
    marginRight: 10,
    //  marginBottom:5,
    marginLeft: 534,
  },
  floorPlanColour: {
    color: "#0C231F",
    fontSize: 34,
    marginTop: 5,
    marginLeft: 5,
    display: "flex",
  },
  floorColour: {
    color: "#0C231F",
    fontSize: 16,
    marginLeft: 20,
    display: "flex",
  },
  logoContactDetailsmages: {
    height: 50,
    width: 85,
    marginTop: -72,
    marginRight: 10,
    //  marginBottom:5,
    marginLeft: 530,
  },
});

////.log('Background color:', styles.body.backgroundColor);
const PdfDownload = ({ reportBuilder, table, selectedPages }) => {
  //.log("selectedPages*==>", selectedPages);
  //   //.log("data PdfDownload*==>", reportBuilder,table);

  //.log("reportBuilder *==>", reportBuilder);
  // //.log('reportBuilder.firstpage *==>',reportBuilder.firstpage)
  // //.log('reportBuilder.firstpage.PropertyType *==>',reportBuilder.firstpage.PropertyType)
  // //.log('reportBuilder.firstpage.imagelink *==>',reportBuilder.firstpage.imagelink)

  return (
    <Document>
      {/*--------------------------- Main Page----------------------------- */}
      {selectedPages.firstpage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "row" }}
        >
          <View style={{ flex: 7, alignItems: "center", paddingTop: 10 }}>
            <Text style={styles.centeredText}>Proposed Option</Text>
            <Text style={styles.centeredText}>For</Text>
            <Text style={styles.centeredText}>
              {reportBuilder.firstpage.PropertyType}
            </Text>
            <Text style={{ ...styles.centeredText, height: 10 }}></Text>

            <Text style={{ ...styles.centeredText, fontSize: 14 }}>
              {reportBuilder.firstpage.Street}, {reportBuilder.firstpage.City}
            </Text>
            <Text style={{ ...styles.centeredText, fontSize: 14 }}>
              {reportBuilder.firstpage.proposalDate}
            </Text>
          </View>
          <View style={{ flex:3 }}>
            <Image
              style={{ ...styles.image }}
              src={reportBuilder.firstpage.imagelink}
            />
          </View>

          <View
            style={{
              position: "absolute",
              fontSize: 12,
              color: "white",
              bottom: 1,
              left: 1,
              right: 265,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>By Sthapatya Leasing & Consultant</Text>
            <Text>{reportBuilder.firstpage.proposalDate}</Text>
          </View>
        </Page>
      )}

      {/*--------------------------- City  Overview Page----------------------------- */}

      {selectedPages.secondpage && (
        <Page size={styles.size} style={styles.body}>
          <View style={styles.twoColumnContainer}>
            <View style={{ ...styles.column}}>
              <Text style={styles.cityOverview}>City Overview</Text>
              <View style={{ marginLeft: 10, marginRight: 10, marginTop: 2 }}>
                <View style={styles.dataBox}>
                  <View
                    style={{ ...styles.columnRow, backgroundColor: "#A27C4B" }}
                  >
                    <Text style={{ ...styles.details }}>Details</Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>State</Text>
                    <Text style={styles.columnRowText}>
                      {reportBuilder.secondpage.State}
                    </Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>City</Text>
                    <Text style={styles.columnRowText}>
                      {reportBuilder.secondpage.City}
                    </Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>Area</Text>
                    <Text style={styles.columnRowText}>
                      {reportBuilder.secondpage.Area}
                    </Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>
                      Population (2023) -{" "} City
                    </Text>

                    <Text style={styles.columnRowText}>
                      {reportBuilder.secondpage.Population}
                    </Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>Population Growth</Text>
                    <Text  style={styles.columnRowText}
>
                      {reportBuilder.secondpage.PopulationGrowth}
                    </Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>
                      Population Density{" "}  (2023)
                    </Text>
                    <Text style={styles.columnRowText}>
                      {reportBuilder.secondpage.PopulationDensity}
                    </Text>

                  </View>
                  <View style={styles.columnRow}>
                    <Text style={styles.columnRowText}>
                      Average literacy rate
                    </Text>
                    <Text  style={styles.columnRowText}>
                      {reportBuilder.secondpage.LiteracyRate}
                    </Text>
                  </View>
                  <View style={styles.columnRow}>
                    <Text   style={styles.columnRowText}>Annual Per Capita </Text>
                    <Text   style={styles.columnRowText}> Income(District) {' '}</Text>
                    <Text style={styles.columnRowText}>
                      {reportBuilder.secondpage.AnnualPerCapita}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 6 }}>
              <Image
                style={styles.cityOverviewImage}
                src={reportBuilder.secondpageimage.imagelink}
              />
            </View>
          </View>
        </Page>
      )}

      {/*--------------------------- Google  View Page----------------------------- */}
      {selectedPages.thirdpage && (
        <Page size={styles.size} style={styles.body}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 10,
              backgroundColor: "#B7A292",
            }}
          >
            <Text style={styles.googleView}>Google View</Text>
            <Image
              style={{ ...styles.size, ...styles.logoImage }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 5, alignItems: "center" }}>
            <Image
              style={{ ...styles.size, ...styles.googleImage }}
              src={reportBuilder.thirdpage.imagelink}
            />
          </View>
        </Page>
      )}

      {/*--------------------------- Property  Images Page----------------------------- */}
      {selectedPages.fourthpage && (
        <Page size={styles.size} style={styles.body}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 10,
              backgroundColor: "#B7A292",
            }}
          >
            <Text style={styles.googleView}>Property Images</Text>
            <Image
              style={{ ...styles.size, ...styles.logoImage }}
              src={reportBuilder.logo}

              // src={reportBuilder.fourthpage.logo}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flex: 2,
                marginTop: 12,
                marginLeft: 8,
                marginRight: 6,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  ...styles.dataBox,
                  backgroundColor: "#B7A292",
                  height: 246,
                }}
              >
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    backgroundColor: "#A27C4B",
                  }}
                >
                  <Text style={{ ...styles.detailsProperty, marginLeft: 15 }}>
                    Parameters
                  </Text>
                  <Text style={{ ...styles.detailsProperty, marginRight: 55 }}>
                    Details
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
                  <Text style={styles.columnRowText}>
                    Floor Plate
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage.FloorPlate}
                  </Text>
                  {/* <Text
                  style={{
                    ...styles.propertyColumnRowText,
                    marginTop: 1,
                    marginLeft: -15,
                  }}
                >
                  {reportBuilder.fourthpage.FloorPlate2}
                </Text> */}
                  {/* <Text
                  style={{
                    ...styles.propertyColumnRowText,
                    marginTop: 24,
                    marginRight: 105,
                  }}
                >
                  {reportBuilder.fourthpage.FloorPlate3}
                </Text> */}
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow2Colour,
                  }}
                >
                    <Text style={styles.columnRowText}>
                    Expected Date of K=HOTP &nbsp; {' '}
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage.ExpectedDate}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
                   <Text style={styles.columnRowText}>
                    Rental
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage.Rental}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow2Colour,
                  }}
                >
                   <Text style={styles.columnRowText}>
                    Frontage{" "}
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage.Frontage}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
                   <Text style={styles.columnRowText}>
                    Location
                  </Text>
                  <Link src={reportBuilder.fourthpage.Location}>
                    <Text
                      style={{
                        ...styles.columnRowText,
                        color: "blue",
                        marginRight: -15,
                      }}
                    >
                      {reportBuilder.fourthpage.Location}
                    </Text>
                  </Link>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow2Colour,
                  }}
                >
                    <Text style={styles.columnRowText}>
                    Tenure
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage.Tenure}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                marginTop: 12,
                marginLeft: 6,
                marginRight: 8,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  ...styles.dataBox,
                  backgroundColor: "#B7A292",
                  height: 246,
                }}
              >
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    backgroundColor: "#A27C4B",
                  }}
                >
                  <Text style={{ ...styles.detailsProperty, marginLeft: 15 }}>
                    Parameters
                  </Text>
                  <Text style={{ ...styles.detailsProperty, marginRight: 55 }}>
                    Details
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
                  <Text style={styles.columnRowText}>
                    Rent Excalation
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.RentExcalation}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow2Colour,
                  }}
                >
                  <Text style={styles.columnRowText}>
                    Maintenance Charges
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.MaintenanceCharges}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
                   <Text style={styles.columnRowText}>
                    Electric Connection
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.ElectricConnection}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow2Colour,
                  }}
                >
                  <Text style={styles.columnRowText}>
                    Taxes{" "}
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.Taxes}
                  </Text>
                  {/* <Text
                  style={{
                    ...styles.propertyColumnRowText,
                    marginTop: 10,
                    marginRight: 51,
                  }}
                >
                  {reportBuilder.fourthpage1.Taxes2}
                </Text> */}
                  {/* <Text
                  style={{
                    ...styles.propertyColumnRowText,
                    marginTop: 28,
                    marginRight: 105,
                  }}
                >
                  {reportBuilder.fourthpage1.Taxes3}
                </Text> */}
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
                  <Text style={styles.columnRowText}>
                    Stamp Duty and Registration
                  </Text>
                  <Text style={styles.columnRowText}>
                    Cos
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.StampDuty}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow2Colour,
                  }}
                >
                  <Text style={styles.columnRowText}>
                    status
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.status}
                  </Text>
                </View>

                <View
                  style={{
                    ...styles.propertyColumnRow,
                    ...styles.propertyRow1Colour,
                  }}
                >
               <Text style={styles.columnRowText}>
                    Neighbouring Brands
                  </Text>
                  <Text style={styles.columnRowText}>
                    {reportBuilder.fourthpage1.NeighbouringBrands}
                  </Text>
                  {/* <Text
                  style={{
                    ...styles.propertyColumnRowText,
                    marginRight: 105,
                    marginTop: 18,
                  }}
                >
                  {reportBuilder.fourthpage1.NeighbouringBrands2}
                </Text> */}
                </View>
              </View>
            </View>
          </View>
        </Page>
      )}

      {/*--------------------------- Modern  Facilities Page----------------------------- */}
      {selectedPages.fifthpage && (
        <Page size={styles.size} style={styles.body}>
          <View style={styles.twoColumnContainer}>
            <View style={{ ...styles.column, flex: 4 }}>
              <Text style={styles.cityOverview}>Modern Facilities</Text>
              <Image
                style={{ height: 248, width: 248, marginTop: 10 }}
                src={reportBuilder.fifthpage.imagelink}
              />
            </View>
            <View style={{ flex: 6, marginTop: 40 }}>
              <Text style={styles.facilityPoint}>
                • {reportBuilder.fifthpage.vaastu}
              </Text>
              <Text style={styles.facilityPoint}>
                • {reportBuilder.fifthpage.ROWater}
              </Text>
              <Text style={styles.facilityPoint}>
                • {reportBuilder.fifthpage.HighSpeed}
              </Text>
              <Text style={styles.facilityPoint}>
                • {reportBuilder.fifthpage.wheelChair}
              </Text>
              <Text style={styles.facilityPoint}>
                • {reportBuilder.fifthpage.maintenanceStaff}
              </Text>
              <Text style={styles.facilityPoint}>
                •{reportBuilder.fifthpage.powerBackup}
              </Text>
              <Text style={styles.facilityPoint}>
                •{reportBuilder.fifthpage.DedicatedParking}
              </Text>
            </View>
          </View>
        </Page>
      )}

      {/*--------------------------- Actual  View Page----------------------------- */}
      {selectedPages.sixthpage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 34,
                marginTop: 10,
                marginLeft: 20,
              }}
            >
              Actual View
            </Text>
            <Image
              style={{ ...styles.logoActualImage }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualViewImage, width: 260 }}
                src={reportBuilder.sixthpage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualViewImage, width: 200 }}
                src={reportBuilder.sixthpage.imagelink2}
              />
            </View>
          </View>
        </Page>
      )}

      {selectedPages.seventhpage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 34,
                marginTop: 5,
                marginLeft: 20,
              }}
            >
              Actual View
            </Text>
            <Image
              style={{ ...styles.logoActualView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Image
              style={{
                ...styles.actualView3Images,
                width: 450,
                marginLeft: 85,
                height: 225,
              }}
              src={reportBuilder.seventhpage.imagelink}
            />
          </View>
        </Page>
      )}

      {selectedPages.eightpage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 34,
                marginTop: 5,
                marginLeft: 20,
              }}
            >
              Actual View
            </Text>
            <Image
              style={{ ...styles.logoActualView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Image
              style={{
                ...styles.actualView3Images,
                width: 450,
                marginLeft: 85,
                height: 225,
              }}
              src={reportBuilder.eightpage.imagelink}
            />
          </View>
        </Page>
      )}

      {selectedPages.ninthpage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 34,
                marginTop: 5,
                marginLeft: 20,
              }}
            >
              Actual View
            </Text>
            <Image
              style={{ ...styles.logoActualView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualView3Images }}
                src={reportBuilder.ninthpage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualView3Images, marginLeft: 0 }}
                src={reportBuilder.ninthpage.imagelink2}
              />
            </View>
          </View>
        </Page>
      )}

      {selectedPages.tenthpage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 34,
                marginTop: 5,
                marginLeft: 20,
              }}
            >
              Actual View
            </Text>
            <Image
              style={{ ...styles.logoActualView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualView3Images }}
                src={reportBuilder.tenthpage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualView3Images, marginLeft: 0 }}
                src={reportBuilder.tenthpage.imagelink2}
              />
            </View>
          </View>
        </Page>
      )}

      {selectedPages.eleventhPage && (
        <Page
          size={styles.size}
          style={{ ...styles.body, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 34,
                marginTop: 5,
                marginLeft: 20,
              }}
            >
              Actual View
            </Text>
            <Image
              style={{ ...styles.logoActualView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualView3Images }}
                src={reportBuilder.eleventhPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.actualView3Images, marginLeft: 0 }}
                src={reportBuilder.eleventhPage.imagelink2}
              />
            </View>
          </View>
        </Page>
      )}

      {/*--------------------------- Brand  Mapping Page----------------------------- */}

      {selectedPages.twelvethPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "black",
                fontSize: 40,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Brand Mapping
            </Text>
            <Image
              style={{ ...styles.logoBrandMappingImages }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.brandMappingImages }}
                src={reportBuilder.twelvethPage.imagelink}
              />
            </View>
          </View>
        </Page>
      )}

      {/*--------------------------- Floor Plan Pages----------------------------- */}
      {selectedPages.thirteenthPage && (
        <Page
          size={styles.size}
          style={{
            ...styles.floorPlanBackgroundColour,
            flexDirection: "column",
          }}
        >
          <View>
            <Text style={{ ...styles.floorPlanColour }}>Floor Plan</Text>
            <Text style={{ ...styles.floorColour }}>Basement Floor</Text>
            1
            <Image
              style={{ ...styles.logoFloorPlanImages }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Image
              style={{ ...styles.floorPlanImages }}
              src={reportBuilder.thirteenthPage.imagelink}
            />
          </View>
        </Page>
      )}
      {selectedPages.fourteenthPage && (
        <Page
          size={styles.size}
          style={{
            ...styles.floorPlanBackgroundColour,
            flexDirection: "column",
          }}
        >
          <View>
            <Text style={{ ...styles.floorPlanColour }}>Floor Plan</Text>
            <Text style={{ ...styles.floorColour }}>Ground Floor</Text>
            1
            <Image
              style={{ ...styles.logoFloorPlanImages }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Image
              style={{ ...styles.floorPlanImages }}
              src={reportBuilder.fourteenthPage.imagelink}
            />
          </View>
        </Page>
      )}
      {selectedPages.fiftenthPage && (
        <Page
          size={styles.size}
          style={{
            ...styles.floorPlanBackgroundColour,
            flexDirection: "column",
          }}
        >
          <View>
            <Text style={{ ...styles.floorPlanColour }}>Floor Plan</Text>
            <Text style={{ ...styles.floorColour }}>
              1
              <Text
                style={{ fontSize: 12, verticalAlign: "super", marginLeft: 2 }}
              >
                st
              </Text>{" "}
              Floor
            </Text>
            1
            <Image
              style={{ ...styles.logoFloorPlanImages }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Image
              style={{ ...styles.floorPlanImages }}
              src={reportBuilder.fiftenthPage.imagelink}
            />
          </View>
        </Page>
      )}
      {selectedPages.sixteenthPage && (
        <Page
          size={styles.size}
          style={{
            ...styles.floorPlanBackgroundColour,
            flexDirection: "column",
          }}
        >
          <View>
            <Image
              style={{ ...styles.logoFloorPlanImages, marginTop: 5 }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Image
              style={{ ...styles.floorPlanImages }}
              src={reportBuilder.sixteenthPage.imagelink}
            />
          </View>
        </Page>
      )}
      {/*--------------------------- Vicinity Images Pages----------------------------- */}

      {selectedPages.seventeenthPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.seventeenthPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.seventeenthPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.seventeenthPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.eighteenthPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.eighteenthPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.eighteenthPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.eighteenthPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.nineteenthpage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.nineteenthpage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.nineteenthpage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.nineteenthpage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.twentythPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentythPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentythPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentythPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.twentyfirstPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentyfirstPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentyfirstPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentyfirstPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.twentysecondPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentysecondPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentysecondPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentysecondPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.twentythirdPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentythirdPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentythirdPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentythirdPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {selectedPages.twentyfourthPage && (
        <Page
          size={styles.size}
          style={{ ...styles.vicinityColour, flexDirection: "column" }}
        >
          <View>
            <Text
              style={{
                color: "#5D4037",
                fontSize: 34,
                marginTop: 15,
                marginLeft: 180,
                display: "flex",
              }}
            >
              Vicinity Images
            </Text>
            <Image
              style={{ ...styles.logoVicinityView3Image }}
              src={reportBuilder.logo.logo}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentyfourthPage.imagelink1}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentyfourthPage.imagelink2}
              />
            </View>
            <View style={{ flex: 4 }}>
              <Image
                style={{ ...styles.vicinityView3Images }}
                src={reportBuilder.twentyfourthPage.imagelink3}
              />
            </View>
          </View>
        </Page>
      )}
      {/*--------------------------- Contact Details Page----------------------------- */}

      {selectedPages.twentyfifthpage && (
        <Page size={styles.size} style={styles.body}>
          <View>
            <Text
              style={{
                color: "#D0CCBE",
                fontSize: 40,
                lineHeight: 1.5,
                display: "flex",
                marginLeft: 5,
                marginTop: 15,
              }}
            >
              Contact Details
            </Text>
            <Image
              style={{ ...styles.logoContactDetailsmages }}
              src={reportBuilder.logo.logo}
            />
            <View style={{ marginTop: 35 }}>
              <Text style={{ marginLeft: 15, fontSize: 14, color: "#D0CCBE" }}>
                {reportBuilder.twentyfifthpage.name}
              </Text>
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: 12,
                  color: "#D0CCBE",
                  marginTop: 4,
                }}
              >
                Mobile : {reportBuilder.twentyfifthpage.mobile}
              </Text>
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: 14,
                  color: "#D0CCBE",
                  marginTop: 14,
                }}
              >
                {reportBuilder.twentyfifthpage.name1}
              </Text>
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: 12,
                  color: "#D0CCBE",
                  marginTop: 4,
                }}
              >
                Mobile : {reportBuilder.twentyfifthpage.mobile1}
              </Text>
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 10,
                  color: "#D0CCBE",
                  marginTop: 14,
                }}
              >
                Email : {reportBuilder.twentyfifthpage.Email}
              </Text>
              {/* <Text style={{ marginLeft: 15, fontSize: 14, color: "#D0CCBE" }}>
              {table.contactname}
            </Text>
            <Text
              style={{
                marginLeft: 15,
                fontSize: 12,
                color: "#D0CCBE",
                marginTop: 4,
              }}
            >
              Mobile : {table.phone}
            </Text>
            <Text
              style={{
                marginLeft: 15,
                fontSize: 14,
                color: "#D0CCBE",
                marginTop: 14,
              }}
            >
              {}
            </Text>
            <Text
              style={{
                marginLeft: 15,
                fontSize: 12,
                color: "#D0CCBE",
                marginTop: 4,
              }}
            >
              Mobile : {}
            </Text>
            <Text
              style={{
                marginLeft: 12,
                fontSize: 10,
                color: "#D0CCBE",
                marginTop: 14,
              }}
            >
              Email : {table.email}
            </Text> */}
              Website :
              <Link src={reportBuilder.twentyfifthpage.Website}>
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: 10,
                    color: "#D0CCBE",
                    marginTop: 4,
                  }}
                >
                  Website :{reportBuilder.twentyfifthpage.Website}
                </Text>
              </Link>
              <Text
                style={{
                  marginLeft: 2,
                  color: "#D0CCBE",
                  fontSize: 10,
                  marginTop: 40,
                }}
              >
                <Text
                  style={{
                    marginLeft: 2,
                    color: "#D0CCBE",
                    fontSize: 12,
                    marginTop: 30,
                  }}
                >
                  Our Address -
                </Text>{" "}
                {reportBuilder.twentyfifthpage.Address}
              </Text>
            </View>

            <View style={{ marginTop: 2, backgroundColor: "#FFFDE7" }}>
              <Text
                style={{
                  marginLeft: 2,
                  color: "#1E2224",
                  fontSize: 8,
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    marginLeft: 2,
                    color: "#9A6237",
                    fontSize: 12,
                    marginTop: 30,
                  }}
                >
                  Disclaimer:
                </Text>{" "}
                {reportBuilder.twentyfifthpage.Disclaimer}
              </Text>
            </View>
          </View>
        </Page>
      )}
      {selectedPages.twentysixthpage && (
        <Page size={styles.size} style={styles.body}>
          <Text
            style={{
              textAlign: "center",
              display: "flex",
              marginTop: "120px",
              alignItems: "center",
              color: "white",
              fontSize: 54,
              justifyContent: "center",
            }}
          >
            Thank you
          </Text>
        </Page>
      )}
    </Document>
  );
};

export default PdfDownload;
