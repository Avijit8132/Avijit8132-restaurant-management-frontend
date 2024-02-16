import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Table,
  Container,
  Modal,
  InputGroup,
} from "react-bootstrap";
import inventoryApi from "../../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import Form from "react-bootstrap/Form";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import jwt_decode from "jwt-decode";
import moment from "moment/moment";

const AttendanceUser = () => {
  const [body, setBody] = useState([]);
  const [allData, setAlldata] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [month, setMonts] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [leavetype, setLeavetype] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [userInfo, setUserInfo] = useState(
    jwt_decode(localStorage.getItem("token"))
  );
  const [validated, setValidated] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${amPm}`;
  };

  console.log(getCurrentTime());

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchAttendance();
      setAlldata(result);
      //.log("result", result);

      if (result && result.length) {
        onFilterData(
          result,
          new Date().getFullYear(),
          new Date().getMonth() + 1
        );
      } else {
        //.log("false");
      }
    }
    const getAllYears = () => {
      const currentDate = new Date();
      const curyear = currentDate.getFullYear();

      const last10Years = Array.from({ length: 10 }, (_, index) =>
        (curyear - index - 1).toString()
      );
      const next10Years = Array.from({ length: 10 }, (_, index) =>
        (curyear + index).toString()
      );
      const allYears = [...last10Years, curyear.toString(), ...next10Years];
      const sortedYears = allYears.sort((a, b) => parseInt(a) - parseInt(b));
      setYearOptions(sortedYears);
    };

    init();
    getAllYears();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    const selectedDate = document.querySelector('[name="date"]').value;
    const allData = await inventoryApi.fetchAttendance();

    const fetcheddate = allData?.map(
      (item) => new Date(item.date).toISOString().split("T")[0]
    );

    const isDateFetched = fetcheddate?.includes(selectedDate);
    const isExistingAttendance = body?.some(
      (item) => item.date === selectedDate
    );

    if (isExistingAttendance || isDateFetched) {
      alert("Attendance for this date already exists.");
      return;
    }

    const saveAttendance = {
      attendance_status: attendanceStatus,
      date: selectedDate,
      leavetype,
      reason,
      status: attendanceStatus === "Leave" ? "Pending..." : "",
      user_id: userInfo.id,
    };

    if (saveAttendance.attendance_status === "Present") {
      saveAttendance.reason = null;
    }

    if (attendanceStatus && attendanceStatus !== "" && selectedDate !== "") {
      let result;

      //.log("attendanceStatus  :-  ", attendanceStatus);
      //.log("leavetype  :-  ", leavetype);
      //.log("reason  :-  ", reason);

      if (attendanceStatus === "Leave" && (leavetype === "" || reason === "")) {
        return;
      }

      result = await inventoryApi.createAttendance(saveAttendance);

      if (result) {
        //.log("body ", body);
        //.log("saveAttendance ", saveAttendance);
        setBody((oldBody) => {
          oldBody.unshift(saveAttendance);
          return oldBody;
        });
        setAttendanceStatus("");
        setShowModal(false);
      }
    }
  };

  const header = [
    {
      title: "Date",
      prop: "date",
      isSortable: true,
      isFilterable: true,
      cell: (row) =>
        row.date ? moment(row.date).format("YYYY-MM-DD") : "",
    },
    {
      title: "Time",
      prop: "date",
      isSortable: true,
      isFilterable: true,
      cell: (row) =>
        row.date ? moment(row.date).format("hh:mm:ss A") : "",
    },

    {
      title: "Attendance Status",
      prop: "attendance_status",
      isFilterable: true,
      isSortable: true,
      cell: (row) => (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "140px",
            height: "15px",
            padding: "10px 10px",
            fontSize: "12px",
            backgroundColor:
              row.attendance_status === "Present" ? "#85d884" : "#EF9F9F",
            color: "black",
            borderRadius: "15px",
          }}
        >
          {row.attendance_status}
        </span>
      ),
    },
    {
      title: "Leave Type",
      prop: "leavetype",
      isFilterable: true,
      isSortable: true,
    },
    {
      title: "Leave Reason",
      prop: "reason",
      isFilterable: true,
      isSortable: true,
      cell: (row) => (
        <span
          className="attendance_Reason"
          data-toggle="tooltip"
          data-placement="bottom"
          title={row.reason}
        >
          {row.reason}
        </span>
      ),
    },
    {
      title: "Status",
      prop: "status",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Remark",
      prop: "remark",
      isSortable: true,
      isFilterable: true,
    },
  ];

  const handleMonth = (event) => {
    setSelectedMonth(parseInt(event.target.value));
    onFilterData(allData, selectedYear, parseInt(event.target.value));
  };

  const handleYear = (event) => {
    setSelectedYear(parseInt(event.target.value));
    onFilterData(allData, parseInt(event.target.value), selectedMonth);
  };

  const onFilterData = (res, yearValue, monthValue) => {
    if (isNaN(monthValue) && isNaN(yearValue)) {
      setBody(res);
    } else {
      const filteredData = res.filter((item) => {
        if (
          monthValue === item.attendancemonth &&
          yearValue === item.attendanceyear
        ) {
          return item;
        } else if (
          (isNaN(monthValue) && yearValue === item.attendanceyear) ||
          (monthValue === item.attendancemonth && isNaN(yearValue))
        ) {
          return item;
        }
      });
      //.log("filteredData:-", filteredData);
      setBody(filteredData);
    }
  };

  const labels = {
    beforeSelect: " ",
  };

  const openModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      setReason("");
      setLeavetype("");
      setAttendanceStatus(null);
      setValidated(false);
    }
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setReason("");
    setLeavetype("");
    setAttendanceStatus(null);
    setValidated(false);
  };

  return (
    <Container>
      <CustomSeparator
        currentCmpName="Attendance"
        indexLength="0"
        url="/data"
      ></CustomSeparator>

      <Row className="g-0">
        <Col lg={12} className="px-4">
          <DatatableWrapper
            body={body}
            headers={header}
            paginationOptionsProps={{
              initialState: {
                rowsPerPage: 10,
                options: [5, 10, 15, 20],
              },
            }}
            sortProps={{
              initialState: {
                prop: "createddate",
                order: "desc",
              },
            }}
          >
            <Row className="mb-4">
              <Col
                xs={12}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Filter />
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-start align-items-center"
              >
                <PaginationOptions labels={labels} />
                <Form.Group className="mx-3 mt-4" controlId="formBasicMonth">
                  <Form.Select
                    aria-label="Enter Month"
                    name="month"
                    onChange={handleMonth}
                  >
                    <option value="">--All Month--</option>
                    {month.map((item, index) => {
                      return item ===
                        new Date().toLocaleString("default", {
                          month: "long",
                        }) ? (
                        <option value={index + 1} key={index} selected>
                          {item}
                        </option>
                      ) : (
                        <option value={index + 1} key={index}>
                          {item}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mx-3 mt-4" controlId="formBasicYear">
                  <Form.Select
                    aria-label="Enter Year"
                    name="year"
                    onChange={handleYear}
                  >
                    <option value="">--All Year--</option>
                    {yearOptions.map((item, index) => {
                      return item === new Date().getFullYear().toString() ? (
                        <option value={item} key={index} selected>
                          {item}
                        </option>
                      ) : (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button
                  className="btn-sm"
                  variant="outline-primary"
                  onClick={openModal}
                >
                  Add Attendance
                </Button>
              </Col>
            </Row>
            {body ? (
              <Table striped className="data-table">
                <TableHeader />

                <TableBody />
              </Table>
            ) : (
              <ShimmerTable row={10} col={8} />
            )}

            <Pagination />
          </DatatableWrapper>
        </Col>
        <Col lg={2}></Col>
      </Row>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3">
                {/* <Form.Group as={Col} md="6" controlId="validationCustom01">
                 <Form.Control
                    required
                    type="date"
                    name="date"
                    //min={moment(new Date()).format('YYYY-MM-DD')}
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    placeholder="Enter Date"
                  /> 
                </Form.Group> */}
                <Col lg={7}>
                  <Form.Group className="mx-3" controlId="formBasicEmail">
                    <InputGroup>
                      <Form.Control
                        type="date"
                        name="date"
                        required
                        min={moment(new Date()).format("YYYY-MM-DD")}
                      />
                      <Form.Control
                        disabled
                        required
                        type="text"
                        name="time"
                        value={getCurrentTime()}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={5}>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationCustom02"
                    style={{ width: "145px" }}
                  >
                    <Form.Select
                      required
                      aria-label="Select Attendance Status"
                      name="attendanceStatus"
                      value={attendanceStatus}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                    >
                      <option value="">--Select Status--</option>
                      <option value="Present">Present</option>
                      <option value="Leave">Leave</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {attendanceStatus === "Leave" ? (
                <>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationCustom03">
                      <Form.Select
                        required
                        aria-label="Select Attendance Status"
                        name="leavetype"
                        value={leavetype}
                        onChange={(e) => setLeavetype(e.target.value)}
                      >
                        <option value="">--Select Leave Type--</option>
                        <option value="First Half Day">First Half Day</option>
                        <option value="Second Half Day">Second Half Day</option>
                        <option value="Full Day">Full Day</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationCustom04">
                      <Form.Control
                        required
                        as="textarea"
                        name="reason"
                        placeholder="Enter Leave Reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </Form.Group>
                  </Row>
                </>
              ) : null}

              <Button onClick={handleSubmit}>Submit form</Button>
              <Button className="ms-2" variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AttendanceUser;
