import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  Button,
  Col,
  Container,
  Row,
  Table,
  Tooltip,
  OverlayTrigger,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../api/inventoryApi";
import { useLocation } from "react-router-dom";
import CustomSeparator from "./Breadcrumbs/CustomSeparator";
import ReportPDF from "./ReportPDF";

// import { ExportJsonCsv } from 'react-export-json-csv';
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import moment, { months } from "moment";
import csvDownload from "json-to-csv-export";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

const ReportView = () => {
  const [arrName, setArrName] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const report = location.state;
  const [body, setBody] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [refreshList, setRefreshList] = useState(Date.now());
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [show, setShow] = useState();
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [fromDateInfo, setFromDateInfo] = useState("");
  const [toDateInfo, setToDateInfo] = useState(moment().format("YYYY-MM-DD"));
  const [filteredText, setFilteredText] = useState();
  const [filteredSlected, setfilteredSelected] = useState();

  useEffect(() => {
    async function init() {
      // //.log(report)
      // //.log('reports', report.id)
      const result = await inventoryApi.fetchReportsById(report);
      // //.log("api response", result);
      if (result && result.length > 0) {
        setArrName(Object.keys(result[0]));
        setAllRecords(result);
        setBody(result);
      }
    }
    init();
  }, []);

  const header = arrName.map((name) => ({
    title: name.charAt(0).toUpperCase() + name.slice(1),
    prop: name,
    isFilterable: true,
  }));

  const labels = {
    beforeSelect: " ",
  };

  const ReportDataCSV = {
    data: body,
    filename: "Report",
    delimiter: ",",
    headers: arrName,
  };

  const pdfRecorder = () => {
    setRefreshList(Date.now());
    setTimeout(function () {
      pdf();
    }, 500);
  };

  const pdf = () => {
    const pdfTable = document.getElementById("divToPrint2");
    var html = htmlToPdfmake(pdfTable.innerHTML, {
      tableAutoSize: true,
    });
    const documentDefinition = {
      content: [html],
      pageBreakBefore: function (currentNode) {
        return (
          currentNode.style &&
          currentNode.style.indexOf("pdf-pagebreak-before") > -1
        );
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).open();
  };

  const handlePeriodChange = (event) => {
    if (event.target.value !== "custom") {
      setSelectedPeriod(event.target.value);
      setCustomFromDate("");
      setCustomToDate("");
    }

    const today = new Date();
    const momentToday = moment();

    setShow(event.target.value);

    if (event.target.value === "last3Months") {
      const lastThreeMonths = new Date(today);
      lastThreeMonths.setMonth(today.getMonth() - 4);

      let resultformatDateString = formatDateString(lastThreeMonths).split("/");
      let finalCompareDate = new Date(
        resultformatDateString[2],
        resultformatDateString[1],
        resultformatDateString[0]
      );

      const threeMonthsAgo = momentToday.subtract(3, "months");
      const formattedThreeMonthsAgo = threeMonthsAgo.format("YYYY-MM-DD");
      setFromDateInfo(formattedThreeMonthsAgo);

      filterAllRecords(finalCompareDate);
    } else if (event.target.value === "last6Months") {
      const lastSixMonths = new Date(today);
      lastSixMonths.setMonth(today.getMonth() - 7);

      let resultformatDateString = formatDateString(lastSixMonths).split("/");
      let finalCompareDate = new Date(
        resultformatDateString[2],
        resultformatDateString[1],
        resultformatDateString[0]
      );

      const threeMonthsAgo = momentToday.subtract(6, "months");
      const formattedThreeMonthsAgo = threeMonthsAgo.format("YYYY-MM-DD");
      setFromDateInfo(formattedThreeMonthsAgo);

      filterAllRecords(finalCompareDate);
    } else if (event.target.value === "lastYear") {
      const lastYear = new Date(today);
      lastYear.setMonth(today.getMonth() - 13);

      let resultformatDateString = formatDateString(lastYear).split("/");
      let finalCompareDate = new Date(
        resultformatDateString[2],
        resultformatDateString[1],
        resultformatDateString[0]
      );

      const threeMonthsAgo = momentToday.subtract(12, "months");
      const formattedThreeMonthsAgo = threeMonthsAgo.format("YYYY-MM-DD");
      setFromDateInfo(formattedThreeMonthsAgo);

      filterAllRecords(finalCompareDate);
    } else if (event.target.value === "custom") {
      setSelectedPeriod(event.target.value);
      setBody(allRecords);
      filterByCustomDates();
    } else {
      setBody(allRecords);
    }
  };

  function filterByCustomDates(fromDate, toDate) {
    if (selectedPeriod === "custom" && fromDate !== "" && toDate !== "") {
      let resultformatDateStringFrom = fromDate.split("-");
      let finalCompareDateFrom = new Date(
        resultformatDateStringFrom[0],
        parseInt(resultformatDateStringFrom[1]),
        resultformatDateStringFrom[2]
      );

      let resultformatDateStringTo = toDate.split("-");
      let finalCompareDateTo = new Date(
        resultformatDateStringTo[0],
        parseInt(resultformatDateStringTo[1]),
        resultformatDateStringTo[2]
      );

      setBody(
        allRecords.filter((lead, index) => {
          let dateString = lead["Created Date"].split("/");
          let createddate = new Date(
            dateString[2],
            dateString[1],
            dateString[0]
          );
          return (
            createddate >= finalCompareDateFrom &&
            createddate <= finalCompareDateTo
          );
        })
      );
    }
  }

  function formatDateString(dateFormat) {
    return `${dateFormat.getDate().toString().padStart(2, "0")}/${(
      dateFormat.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateFormat.getFullYear()}`;
  }

  function filterAllRecords(fromTargetDate) {
    setBody(
      allRecords.filter((lead) => {
        let dateString = lead["Created Date"].split("/");
        let createddate = new Date(dateString[2], dateString[1], dateString[0]);
        return createddate >= fromTargetDate;
      })
    );
  }

  const handleFilter = (filterText) => {
    console.log("allRecords", allRecords);
    const lowercasedFilterText = filterText.toLowerCase();
    const filteredData = allRecords.filter((row) => {
      return Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowercasedFilterText)
      );
    });

    setBody(filteredData);
  };

  return (
    <>
      {/* <CustomSeparator cmpListName="" cmpViewName="" > </CustomSeparator> */}
      <Container>
        <CustomSeparator
          cmpListName="Report Name"
          currentCmpName={report.name}
          indexLength="2"
          url="/reports"
        ></CustomSeparator>
      </Container>
      <Row className="g-0">
        <Col lg={2} className="mx-2"></Col>
        <Col lg={12} className="p-lg-4">
          {body ? (
            <DatatableWrapper
              body={body}
              headers={header}
              paginationOptionsProps={{ initialState: { rowsPerPage: 100 } }}
            >
              <Row className="d-flex align-items-center mb-4">
                {/* <div className="col-6 col-sm-3">
                <p style={{ fontSize: "small" }}>Report Name:</p>
                <b>{report.name}</b>
              </div> */}
                <Col
                  //xs={12}
                  lg={3}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <InputGroup>
                    <Form.Control
                      type="text"
                      className="inputbox"
                      placeholder="Enter text"
                      onChange={(e) => {
                        handleFilter(e.target.value);
                      }}
                    />

                    <Button
                      variant="primary"
                      onClick={() => {
                        //.log('insdode', document.querySelector(".inputbox").value);
                        document.querySelector(".inputbox").value = "";
                        handleFilter("");
                      }}
                    >
                      <b>×</b>
                    </Button>
                  </InputGroup>
                </Col>

                {/* <Col xs={6} sm={6} lg={3} className="d-flex flex-col justify-content-end align-items-end">
                  <Filter />
                </Col> */}

                <Col xs={6} sm={8} lg={2}>
                  <Form.Group controlId="formBasicFilterType">
                    <Form.Select
                      aria-label="Select Filter Type"
                      name="type"
                      onChange={handlePeriodChange}
                      className="select-dropdown-1"
                    >
                      <option value="">Select Time Period</option>
                      <option value="last3Months">Last 3 Months</option>
                      <option value="last6Months">Last 6 Months</option>
                      <option value="lastYear">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {selectedPeriod !== "custom" && selectedPeriod !== "" && (
                  <>
                    <Col
                      xs={4}
                      sm={4}
                      lg={2}
                      className="d-flex align-items-center"
                    >
                      <Form.Label>
                        <b>From&nbsp;&nbsp;&nbsp;</b>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="input"
                        disabled
                        value={fromDateInfo}
                      />
                    </Col>
                    <Col
                      xs={4}
                      sm={4}
                      lg={2}
                      className="d-flex align-items-center"
                    >
                      <Form.Label>
                        <b>To&nbsp;&nbsp;&nbsp;</b>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="input"
                        disabled
                        value={toDateInfo}
                      />
                    </Col>
                  </>
                )}

                {selectedPeriod === "custom" && (
                  <>
                    <Col
                      xs={4}
                      sm={4}
                      lg={2}
                      className="d-flex align-items-center"
                    >
                      <Form.Label>
                        <b>From&nbsp;&nbsp;&nbsp;</b>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="input"
                        value={customFromDate}
                        onChange={(e) => {
                          setCustomFromDate(e.target.value);
                          filterByCustomDates(e.target.value, customToDate);
                        }}
                      />
                    </Col>
                    <Col
                      xs={4}
                      sm={4}
                      lg={2}
                      className="d-flex align-items-center"
                    >
                      <Form.Label>
                        <b>To&nbsp;&nbsp;&nbsp;</b>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="input"
                        value={customToDate}
                        onChange={(e) => {
                          setCustomToDate(e.target.value);
                          filterByCustomDates(customFromDate, e.target.value);
                        }}
                      />
                    </Col>
                  </>
                )}

                {/* <Col>
                  <div className="row">
                    <div className="d-flex align-items-center mt-3">
                      <Button
                        className="btn-sm mr-2"
                        variant="outline-success"
                        onClick={() => csvDownload(ReportDataCSV)}
                      >
                        <i className="fa-solid fa-file-csv" style={{ fontSize: '24px' }}></i>
                      </Button>
                    </div>
                    <div className="w-100"></div>
                  </div>
                  <div className="col-3 col-sm-2">
                    <Button className='btn-sm' variant='danger' onClick={() => pdfRecorder()} s>
                      <i className="fa-solid fa-print"></i> PDF
                    </Button>
                  </div>
                </Col> */}

                <Col className="d-flex flex-row justify-content-end">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className="my-tooltip">Download</Tooltip>}
                  >
                    <Button
                      className="btn-sm mr-2"
                      variant="outline-success"
                      onClick={() => csvDownload(ReportDataCSV)}
                    >
                      <i
                        className="fa-solid fa-file-csv"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>

              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <div className="App container mt-5" style={{ display: "none" }}>
          <div id="divToPrint2">
            <ReportPDF
              reports={body}
              report={report}
              headers={header}
              refresh={refreshList}
              arrName={arrName}
              values={values}
              fields={fields}
            />
          </div>
        </div>
      </Row>
    </>
  );
};

export default ReportView;
