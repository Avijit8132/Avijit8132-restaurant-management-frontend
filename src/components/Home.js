import React, { useEffect, useState } from "react";

import { Badge, Col, Container, Pagination, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import HorizontalBarChart from "./charts/HorizontalBarChart";
import moment from "moment";

import inventoryApi from "../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import {
  DatatableWrapper,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import LeadVerticalBarChat from "./charts/DoughnutChat";

const Home = (arrayOfTask) => {
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("last6Months");
  const [customFromDate, setCustomFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0]);
  const [customToDate, setCustomToDate] = useState(new Date().toISOString().split('T')[0]);
  const [body, setBody] = useState([]);
  const [body1, setBody1] = useState([]);
  const [calender, setCalender] = useState([]);

  const VerticalColors = {
    Leave: "#EF9F9F",
    Present: "#85d884",
  };

  const handlePeriodChange = (event) => {
  
    if (event.target.value === "last3Months") {
      setSelectedPeriod(event.target.value);
      setCustomFromDate(new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0]);
   
    } else if (event.target.value === "last6Months") {
      setSelectedPeriod(event.target.value);
      setCustomFromDate(new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0]);
    
    } else if (event.target.value === "lastYear") {
      setSelectedPeriod(event.target.value);
      setCustomFromDate(new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split('T')[0]);
   
    } else {
      setSelectedPeriod(event.target.value);
    }
  };
  

  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const allMeetings = await inventoryApi.fetchAllMeetings("today");
      setTodayMeetings(allMeetings ? allMeetings : []);

      let totalPropertiesData = await inventoryApi.fetchCountOfProperties();
      if (totalPropertiesData?.length > 0) {
        setTotalProperties(totalPropertiesData[0]["totalproperties"]);
      }

      let totalContactsData = await inventoryApi.fetchCountOfContacts();
      if (totalContactsData?.length > 0) {
        setTotalContacts(totalContactsData[0]["totalcontacts"]);
      }
      let totalLeadsData = await inventoryApi.fetchCountOfLeads();
      if (totalLeadsData?.length > 0) {
        setTotalLeads(totalLeadsData[0]["totalleads"]);
      }
      let totalIncomeData = await inventoryApi.fetchTotalIncome();
      if (totalIncomeData?.length > 0) {
        setTotalIncome(totalIncomeData[0]["totalincome"]);
      }
    }

    init();
  }, []);


  useEffect(() => {
    async function init() {
      const data = await inventoryApi.fetchTasksWithoutParent();
      setCalender(
        Array.isArray(data) && data.length
          ? data.filter(
              (e) =>
                moment(new Date(e.startdatetime)).format("YYYY-MM-DD") ===
                moment(new Date()).format("YYYY-MM-DD")
            )?.length
          : 0
      );
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      const data = await inventoryApi.fetchAttendance();
      if (data && data?.length > 0) {
        setBody(
          data.filter(
            (e) =>
              moment(new Date(e.date)).format("YYYY-MM-DD") ===
              moment(new Date()).format("YYYY-MM-DD")
          )
        );
      } else {
        setBody([]);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchDailyTasks();
      if (result) {

        setBody1( result.filter(
            (e) =>
              moment(new Date(e.createddate)).format("YYYY-MM-DD") ===
              moment(new Date()).format("YYYY-MM-DD")
          )
        )
      } else {
        setBody1([]);
      }
    }
    init();
  }, []);

  const header = [
    {
      title: "Name",
      prop: "username",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Status",
      prop: "status",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Attendance status",
      prop: "attendance_status",
      isSortable: true,
      isFilterable: true,
      cell: (row) => {
        return (
          <Badge
            bg={VerticalColors[row.attendance_status]}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "150px",
              height: "15px",
              padding: "10px 10px",
              fontSize: "0.9rem",
              backgroundColor: VerticalColors[row.attendance_status],
              color: "black",
              borderRadius: "15px",
            }}
          >
            {row.attendance_status}
          </Badge>
        );
      },
    },
  ];

  const header1 = [
    {
      title: "Title",
      prop: "title",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Status",
      prop: "status",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Assigned staff",
      prop: "ownername",
      isSortable: true,
      isFilterable: true,
    },
  ];


  return (
    <Container>
      <Row className="justify-content-between mt-4">
        <Col lg={3} className="mt-3">
          <Link to="/properties" className="text-decoration-none text-reset">
            <div
              className="p-3 d-flex align-items-center "
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #000",
              }}
            >
              <span class="fa-stack small">
                <i
                  class="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "#000" }}
                ></i>
                <i
                  class="fa-solid fa-building fa-stack-1x"
                  style={{ color: "white", fontSize: "2rem" }}
                ></i>
              </span>
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">INVENTORIES</h6>
                <h1 className="mb-0 d-inline ">{totalProperties}</h1>
                <Badge bg="light" text="dark">
                  ALL
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
        <Col lg={3} className="mt-3">
          <Link to="/contacts" className="text-decoration-none text-reset">
            <div
              className="p-3 d-flex align-items-center "
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #FF7900",
              }}
            >
              <span class="fa-stack small">
                <i
                  class="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "#FF7900" }}
                ></i>
                <i
                  class="fa fa-users fa-stack-1x"
                  style={{ color: "white", fontSize: "2rem" }}
                ></i>
              </span>
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1 ">CUSTOMERS</h6>
                <h1 className="mb-0 d-inline ">{totalContacts}</h1>
                <Badge bg="light" text="dark">
                  All
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
        <Col lg={3} className="mt-3">
          <Link to="/leads" className="text-decoration-none text-reset">
            <div
              className="p-3 d-flex align-items-center "
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #008000",
              }}
            >
              <span class="fa-stack small">
                <i
                  class="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "#008000" }}
                ></i>
                <i
                  class="fa-solid fa-bolt fa-stack-1x"
                  style={{ color: "white", fontSize: "2rem" }}
                ></i>
              </span>
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">LEADS</h6>
                <h1 className="mb-0 d-inline ">{totalLeads}</h1>
                <Badge bg="light" text="dark">
                  ALL
                </Badge>
              </div>
            </div>
          </Link>
        </Col>

        <Col lg={3} className="mt-3">
          <Link to="/transactions" className="text-decoration-none text-reset">
            <div
              className="p-3 d-flex align-items-center "
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #4169e1!",
              }}
            >
              {/* <i className="flex-shrink-0 me-3 fa-solid fa-building fa-3x circle-icon" style={{color: 'green'}}></i> */}

              <span class="fa-stack small">
                <i
                  class="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "#4169e1" }}
                ></i>
                <i
                  class="fa-solid fa-indian-rupee-sign fa-stack-1x"
                  style={{ color: "white", fontSize: "2rem" }}
                ></i>
              </span>
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">INCOME</h6>
                <h1 className="mb-0 d-inline ">
                  {parseFloat(totalIncome / 100000).toFixed(2)}
                </h1>{" "}
                <Badge bg="light" text="dark">
                  ₹ Lakh
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
      </Row>
      <br />

      <Card.Header style={{ backgroundColor: "white", color: "black"}}>
        <Row>
          <Col lg={3} className="m-3">
            <label>
              Select Time Period:
              <select value={selectedPeriod} onChange={handlePeriodChange}>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="lastYear">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </label>
          </Col>

         
            <>
            <Col lg={2}  className="mt-2">
          
                <label >
                  From Date:
                  <input
                  disabled={selectedPeriod !== "custom"}
                    className="input"
                    type="date"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                  />
                </label>
                </Col>
                <Col lg={2} className="mt-2" >
                <label>
                  To Date:
                  <input
                   disabled={selectedPeriod !== "custom"}
                    className="input"
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                  />
                </label>
            
            </Col>
            </>
        
        
        </Row>
      </Card.Header>

      {
        <Row className="mt-4 justify-content-between">
          <Col lg={6} className="mt-3">
            <Card style={{ height: "30rem" }}>
              <Card.Header style={{ backgroundColor: "RGB(227, 30, 36)", color: "white" }}>
                <b>
                  {" "}
                  <center> Leads Report by Stage</center>
                </b>
              </Card.Header>
              <Card.Body>
                <BarChart
                  customToDate={customToDate}
                  customFromDate={customFromDate}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mt-3">
            <Card style={{ height: "30rem" }}>
              <Card.Header style={{ backgroundColor: "RGB(227, 30, 36)", color: "white" }}>
                <b>
                  {" "}
                  <center> Leads Report by Vertical </center>
                </b>
              </Card.Header>
              <Card.Body>
                <LeadVerticalBarChat
                  customToDate={customToDate}
                  customFromDate={customFromDate}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mt-3">
            <Card style={{ height: "30rem" }}>
              <Card.Header style={{ backgroundColor: "RGB(227, 30, 36)", color: "white" }}>
                <b>
                  <center> Leads Report by User</center>
                </b>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart
                  customToDate={customToDate}
                  customFromDate={customFromDate}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mt-3">
            <Card style={{ height: "30rem" }}>
              <Card.Header style={{ backgroundColor: "RGB(227, 30, 36)", color: "white" }}>
                <b>
                  <center> Inventory Area Wise</center>
                </b>
              </Card.Header>
              <Card.Body>
                <PieChart
                  customToDate={customToDate}
                  customFromDate={customFromDate}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mt-3">
            <Card style={{ height: "30rem" }}>
              <Card.Header style={{backgroundColor: "RGB(227, 30, 36)", color: "white" }}>
                <b>
                  {" "}
                  <center> Attendence Report</center>
                </b>
              </Card.Header>

              <Col lg={15} className="px-4">
                {body ? (
                  <DatatableWrapper body={body} headers={header}>
                    <Row className="mb-4 row align-items-end justify-content-between"></Row>
                    <Table striped className="data-table">
                      <TableHeader />
                      <TableBody />
                    </Table>
                    <Pagination />
                  </DatatableWrapper>
                ) : (
                  <ShimmerTable row={10} col={8} />
                )}
              </Col>
              <Col lg={2}></Col>
            </Card>
          </Col>

          <Col lg={6} className="mt-3">
            <Card style={{ height: "30rem" }}>
              <Card.Header style={{ backgroundColor: "RGB(227, 30, 36)", color: "white" }}>
                <b>
                  <center> Daily task Report</center>
                </b>
              </Card.Header>
              <Col lg={15} className="px-4">
                {body1 ? (
                  <DatatableWrapper
                    body={body1}
                    headers={header1}
                    sortProps={{
                      initialState: {
                        prop: "createddate",
                        order: "desc",
                      },
                    }}
                  >
                    <Row className="mb-4 row align-items-end justify-content-between"></Row>
                    <Table striped className="data-table">
                      <TableHeader />
                      <TableBody />
                    </Table>
                    <Pagination />
                  </DatatableWrapper>
                ) : (
                  <ShimmerTable row={10} col={8} />
                )}
              </Col>
              <Col lg={2}></Col>
            </Card>
          </Col>
          <Col lg={6} className="mt-3 mb-3">
            <Card style={{ height: "15rem" }}>
              <Card.Header style={{backgroundColor: "RGB(227, 30, 36)", color: "white"  }}>
                <b>
                  <center> Quick Actions</center>
                </b>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4 row align-items-end justify-content-between">
                  <Col>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: "#79E2DA",
                        width: "15rem",
                        color: "black",
                      }}
                      onClick={() => navigate(`/leads/e`)}
                    >
                      <i className="fa-solid fa-bolt"></i> New Lead
                    </button>
                    <br />
                    <button
                      type="button"
                      className="mt-2 btn"
                      style={{
                        backgroundColor: "#DDE279",
                        width: "15rem",
                        color: "black",
                      }}
                      onClick={() => navigate(`/properties/e`)}
                    >
                      <i className="fa-solid fa-building "></i>&nbsp; New
                      Inventory
                    </button>
                    <br />
                    <button
                      type="button"
                      className="mt-2 btn"
                      style={{
                        backgroundColor: "#7CE279",
                        width: "15rem",
                        color: "black",
                      }}
                      onClick={() => navigate(`/contacts/e`)}
                    >
                      <i className="fa-solid fa-address-book"></i>&nbsp;New
                      Contact
                    </button>
                    <button
                      type="button"
                      className="mt-2 btn"
                      style={{
                        backgroundColor: "#7df279",
                        width: "15rem",
                        color: "black",
                      }}
                      onClick={() => navigate(`/leadTaskList`)}
                    >
                      <i className="fas fa-tasks"></i>&nbsp; Lead Task
                    </button>
                  </Col>

                  <Col style={{ marginTop: "5px" }}>
                    <center>
                      <Row>
                        <h4>
                          You have <h4 style={{ color: "blue" }}>{calender}</h4>{" "}
                          meetings today !
                        </h4>
                        <i
                          style={{ fontSize: "26px", color: "#F95F47" }}
                          class="fa fa-calendar"
                          aria-hidden="true"
                        ></i>
                      </Row>
                      <Row></Row>
                    </center>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      }
    </Container>
  );
};

export default Home;
