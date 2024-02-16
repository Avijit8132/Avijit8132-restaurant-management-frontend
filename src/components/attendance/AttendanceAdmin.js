import React, { useEffect, useState } from "react";
import { Modal, Button, Col, Row, Table, Container } from "react-bootstrap";
import inventoryApi from "../../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import Form from "react-bootstrap/Form";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import moment from "moment/moment";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

const AttendanceAdmin = () => {
  const [body, setBody] = useState([]);
  const [allData, setAlldata] = useState([]);
  const [currentMonth, setcurrentMonth] = useState();
  const [currentYear, setcurrentYear] = useState();
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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
  const labels = {
    beforeSelect: " ",
  };
  // const header = [
  //   {
  //     title: "Date",
  //     prop: "date",
  //     isSortable: true,
  //     isFilterable: true,
  //     cell: (row) => (row.date ? moment(row.date).format("DD-MM-YYYY") : ""),
  //   },

  //   {
  //     title: "Attendance Status",
  //     prop: "attendance_status",
  //     isFilterable: true,
  //     isSortable: true,
  //     cell: (row) => (
  //       <span
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           width: "140px",
  //           height: "15px",
  //           padding: "10px 10px",
  //           fontSize: "12px",
  //           backgroundColor:
  //             row.attendance_status === "Present" ? "#85d884" : "#EF9F9F",
  //           color: "black",
  //           borderRadius: "15px",
  //         }}
  //       >
  //         {row.attendance_status}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: "Leave Type",
  //     prop: "leavetype",
  //     isFilterable: true,
  //     isSortable: true,
  //   },
  //   {
  //     title: "Leave Reason",
  //     prop: "reason",
  //     isFilterable: true,
  //     isSortable: true,
  //     cell: (row) => (
  //       <span
  //         className="attendance_Reason"
  //         data-toggle="tooltip"
  //         data-placement="bottom"
  //         title={row.reason}
  //       >
  //         {row.reason}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: "Status",
  //     prop: "status",
  //     isSortable: true,
  //     isFilterable: true,
  //   },
  //   {
  //     title: "Remark",
  //     prop: "remark",
  //     isSortable: true,
  //     isFilterable: true,
  //   },
  // ];

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [remark, setRemark] = useState("");
  const [updatedItem, setUpdatedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortedColumn, setSortedColumn] = useState(null);

  useEffect(() => {
    async function init() {
      const currentDate = new Date();
      setcurrentMonth(currentDate.toLocaleString("default", { month: "long" }));
      setcurrentYear(currentDate.getFullYear().toString());
      setSelectedMonth(currentDate.getMonth() + 1);
      setSelectedYear(currentDate.getFullYear());

      const data = await inventoryApi.fetchAttendance();
    
      if (data && data.length) {
        //.log('searchQuery1',data);

        setBody(data);
        setAlldata(data);
        onFilterData(data, new Date().getFullYear().toString(), (new Date().getMonth() + 1).toString());
      } else {
        setBody([]);
        setAlldata([]);
      }
    }
    init();
  }, []);

  const handleMonth = (event) => {
    setSelectedMonth(event.target.value);
    onFilterData(allData, selectedYear, event.target.value);
  };

  const handleYear = (event) => {
    setSelectedYear(event.target.value);
    onFilterData(allData, event.target.value, selectedMonth); 
  };

  const onFilterData = (res, yearValue, monthValue) => {
    if (monthValue === "" && yearValue === "" ) {
      setBody(res);
    } else {   
      const filteredData = res.filter((item) => {
       
        if (monthValue === String(item.attendancemonth)){
          if(yearValue === item.attendanceyear){
            return item;
          }
        } else if (yearValue === String(item.attendanceyear)){
          if(monthValue === item.attendancemonth){
            return item;
          }else if(monthValue === ''){
            return item;
          }
        } else if (monthValue === ''){
          if(yearValue === item.attendanceyear){
            return item;
          }
        }
        return  yearValue === String(item.attendanceyear) && monthValue === String(item.attendancemonth);
        
      });
      //.log('searchQuery2',filteredData);

      setBody(filteredData);
    }
  };

  useEffect(() => {
    const getAllYears = () => {
        const currentDate = new Date();
        const curyear = currentDate.getFullYear();
        const last10Years = Array.from({ length: 10 }, (_, index) =>
          (curyear - index - 1).toString()
        );
        const next10Years = Array.from({ length: 10 }, (_, index) =>
          (curyear + index).toString()
        );
        const allYears = [...last10Years, ...next10Years];
        const sortedYears = allYears.sort((a, b) => parseInt(a) - parseInt(b));
        setYearOptions(sortedYears);
      };

    getAllYears();
  }, []);

const filteredData = () => {
    if (searchQuery === "") {
      return body;
    }
    //.log('searchQuery3',searchQuery);

    // const formattedSearchDate = moment(searchQuery, "DD-MM-YYYY", true).format(
    //   "YYYY-MM-DD"
    // );
    return body.filter(
      (row) =>
        (row.username &&
          row.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.date &&
          moment(row.date).format("YYYY-MM-DD").includes(searchQuery)) ||
        (row.attendance_status &&
          row.attendance_status
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (row.leavetype &&
          row.leavetype.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.reason &&
          row.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.status && row.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  
  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleApprove = async (row) => {
    const updatedItem = { ...row, status: "Approved" };
    saveAttendanceAndUpdateState(updatedItem);
  };

  const handleReject = (row) => {
    setUpdatedItem(row);
    setShowPopup(true);
  };

  const handleRejectWithRemark = async () => {
    const dataById = await inventoryApi.fetchAttendanceById(updatedItem.id);
    //.log("dataById", dataById);

    const updatedItemWithRemark = {
      ...updatedItem,
      status: "Rejected",
      remark: remark,
    };
    saveAttendanceAndUpdateState(updatedItemWithRemark);
    setShowPopup(false);
    setRemark("");
  };

  const saveAttendanceAndUpdateState = async (updatedItem) => {
    const data = await inventoryApi.saveAttendance(updatedItem);
    //.log("data", data);

    const updatedData = body.map((item) => {
      return item.id === updatedItem.id ? updatedItem : item;
    });
    //.log('searchQuery',updatedData);

    setBody(updatedData);
    setUpdatedItem(null);
  };

const handleSort = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedColumn(column);
    }
  };
  
  const renderSortIcon = (column) => (
    <span className="px-1">
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="sort-up"
        className={`svg-inline--fa fa-solid fa-sort-up fa-fwicon ${
          sortedColumn === column && sortOrder === "asc" ? "active" : ""
        }`}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path fill="currentColor" d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path>
      </svg>
    </span>
  );
  
  const paginateData = () => {
    const sortedData = filteredData().sort((a, b) => {
      if (sortedColumn) {
        if (a[sortedColumn] < b[sortedColumn]) {
          return sortOrder === "asc" ? -1 : 1;
        } else if (a[sortedColumn] > b[sortedColumn]) {
          return sortOrder === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    return sortedData.slice(startIndex, endIndex);
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
          <Row className="mb-4">
          {/* <Col lg={12} className="px-4">
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
                      return item === new Date().toLocaleString("default", { month: "long" }) ? (
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
        </Col> */}
            <Col
              xs={12}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <div className="input-group">
                <input
                  name="table-filter"
                  placeholder="Enter text..."
                  type="text"
                  class="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                ></input>
                <button
                  type="button"
                  aria-label="Clear filter"
                  class="btn btn-primary"
                  onClick={clearSearch}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="xmark"
                    className="svg-inline--fa fa-xmark fa-solid fa-times fa-fw"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                    ></path>
                  </svg>
                </button>
              </div> 
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-center"
            >
              <Form.Group className="mx-3 mt-4" controlId="formGroupPagination">
                <Form.Select
                  aria-label="Select Items Per Page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mx-3 mt-4" controlId="formBasicMonth">
                <Form.Select
                  aria-label="Enter Month"
                  name="month"
                  onChange={handleMonth}
                >
                  <option value="">--All Month--</option>
                  {month.map((item, index) => {
                    return item === currentMonth ? (
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
                    return item === currentYear ? (
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
            </Col> 
          </Row>
          {body ? (
            <Table striped className="data-table">
              <thead style={{ cursor: "pointer" }}>
                <tr
                  className="g-0"
                  style={{
                    backgroundColor: "#1a293b",
                    color: "#fff",
                    border: "1px solid #1a293b",
                    padding: "0.5rem 0.5rem",
                  }}
                >
                    <th className="px-4" onClick={() => handleSort("username")}>
                        Name
                        {renderSortIcon("username")}
                    </th>
                    <th className="px-4" onClick={() => handleSort("date")}>
                        Date
                        {renderSortIcon("date")}
                    </th>   
                    <th className="px-4" onClick={() => handleSort("date")}>
                        Time
                        {renderSortIcon("date")}
                    </th>   
                    <th className="px-4" onClick={() => handleSort("attendance_status")}>
                    Attendance Status
                        {renderSortIcon("attendance_status")}
                    </th>
                    <th className="px-4" onClick={() => handleSort("leavetype")}>
                    Leave Type
                        {renderSortIcon("leavetype")}
                    </th> 
                    <th className="px-4" onClick={() => handleSort("reason")}>
                    Leave Reason
                        {renderSortIcon("reason")}
                    </th>
                    <th className="px-4" onClick={() => handleSort("status")}>
                    Status
                        {renderSortIcon("status")}
                    </th>  
                    <th className="px-4" onClick={() => handleSort("remark")}>
                    Remark
                        {renderSortIcon("remark")}
                    </th> 
                </tr>
              </thead>
              <tbody>
                {paginateData().map((row, index) => (
                  <tr key={index}>
                    <td>{row.username}</td>
                    <td>
                      {row.date ? moment(row.date).format("YYYY-MM-DD") : ""}
                    </td>
                    <td>
                      {row.date ?moment(row.date).format("hh:mm:ss A")  : ""}
                    </td>
                    <td>
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
                          borderRadius: "15px"
                        }}
                      >
                        {row.attendance_status}
                      </span>
                    </td>
                    <td>{row.leavetype}</td>

                    <td
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title={row.reason}
                    >
                      <span className="attendance_Reason tooltiptext">
                        {row.reason}
                      </span>
                    </td>
                    <td>
                      {row.attendance_status === "Leave" &&
                      row.status === "Pending..." ? (
                        <>
                          <Button
                          className="me-2"
                            variant="success"
                            onClick={() => handleApprove(row)}
                            style={{ backgroundColor: '#85d884', color:"black" }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleReject(row)}
                            style={{ backgroundColor: '#EF9F9F', color:"black" }}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>{row.status}</>
                      )}
                    </td>
                    <td>{row.remark}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <ShimmerTable row={10} col={8} />
          )}
          <Modal show={showPopup} onHide={() => setShowPopup(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Remark</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter remark..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPopup(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRejectWithRemark(updatedItem)}
                disabled={!remark.trim()} 
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
         <div
            aria-label="Pagination button group"
            role="group"
            class="ButtonGroup__root btn-group"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              aria-label="Go to first page"
              className="btn btn-primary"
              onClick={() => setCurrentPage(1)}
            >
              First
            </button>

            <button
              type="button"
              disabled={currentPage === 1}
              aria-label="Go to previous page"
              className="btn btn-primary"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {[
              ...Array(Math.ceil(filteredData().length / itemsPerPage)).keys(),
            ].map((page) => (
              <button
                key={page}
                type="button"
                disabled={currentPage === page + 1}
                aria-label={`Go to page ${page + 1}`}
                className="btn btn-primary"
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={
                currentPage ===
                  Math.ceil(filteredData().length / itemsPerPage) ||
                itemsPerPage === 0
              }
              aria-label={`Go to next page`}
              className="btn btn-primary"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>

            <button
              type="button"
              disabled={
                currentPage ===
                  Math.ceil(filteredData().length / itemsPerPage) ||
                itemsPerPage === 0
              }
              aria-label={`Go to last page`}
              className="btn btn-primary"
              onClick={() =>
                setCurrentPage(Math.ceil(filteredData().length / itemsPerPage))
              }
            >
              Last
            </button>
          </div> 
        </Col>
        <Col lg={2}></Col>
      </Row>
    </Container>
  );
};

export default AttendanceAdmin;
