import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import AttendanceAdmin from "./AttendanceAdmin";
import AttendanceUser from "./AttendanceUser";
const Attendance = () => {

  const [userInfo, setUserInfo] = useState(
    jwt_decode(localStorage.getItem("token"))
  );

  return (
    <>
    {userInfo.userrole === "SUPER_ADMIN" ? <AttendanceAdmin/> : <AttendanceUser/>}
    </>
  );
};

export default Attendance;









// import React, { useState, useEffect } from "react";
// import { Button, Col, Row, Table, Container } from "react-bootstrap";
// import inventoryApi from "../api/inventoryApi";

// const Attendance = () => {
//   const [attendanceStatus, setattendanceStatus] = useState(
//     Array(31).fill(null)
//   );
//   const [leaveType, setleaveType] = useState(Array(31).fill(""));
//   const [leaveReason, setleaveReason] = useState(Array(31).fill(""));
//   const [currentDate, setCurrentDate] = useState("");
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function init() {
//       const data = await inventoryApi.fetchaAttendance();
//       //.log("data", data);
//       setData(data);
//     }
//     init();
//   }, []);

//   useEffect(() => {
//     const date = new Date();
//     const formattedDate = date.toLocaleDateString("en-US");
//     //.log("formattedDate", formattedDate);
//     setCurrentDate(formattedDate);
//   }, []);

//   // Generate an array of dates for the current month
//   const generateDatesForCurrentMonth = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = today.getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const dates = [];
//     for (let day = 1; day <= daysInMonth; day++) {
//       dates.push(new Date(year, month, day).toLocaleDateString("en-US"));
//     }

//     return dates;
//   };

//   const handleMarkAttendance = (index) => {
//     const saveAttendance = {
//       date: generateDatesForCurrentMonth()[index],
//       attendanceStatus: attendanceStatus[index],
//       leaveType: leaveType[index],
//       leaveReason: leaveReason[index],
//     };

//     //.log("Attendance Marked for Date:", saveAttendance);
//   };

//   const handleAttendanceStatusChange = (index, value) => {
//     const updatedattendanceStatus = [...attendanceStatus];
//     updatedattendanceStatus[index] = value;
//     setattendanceStatus(updatedattendanceStatus);
//   };

//   const handleLeaveTypeChange = (index, value) => {
//     const updatedleaveType = [...leaveType];
//     updatedleaveType[index] = value;
//     setleaveType(updatedleaveType);
//   };

//   const handleLeaveReasonChange = (index, value) => {
//     const updatedleaveReason = [...leaveReason];
//     updatedleaveReason[index] = value;
//     setleaveReason(updatedleaveReason);
//   };

//   const dateDataMap = {};
//   data.forEach((record) => {
//     const dateKey = new Date(record.date).toLocaleDateString("en-US");
//     if (!dateDataMap[dateKey]) {
//       dateDataMap[dateKey] = [];
//     }
//     dateDataMap[dateKey].push(record);
//     //.log("dateDataMap", dateDataMap);
//   });

//   return (
//     <Container>
//       <div className="g-0 row">
//         <div className="px-4 col-lg-12">
//           <Table striped className="data-table">
//             <Row
//               className="g-0"
//               style={{
//                 backgroundColor: "#1a293b",
//                 color: "#fff",
//                 border: "1px solid #1a293b",
//                 padding: "0.5rem 0.5rem",
//               }}
//             >
//               <Col lg={2} className="px-4">
//                 Date
//               </Col>
//               <Col lg={2} className="px-4">
//                 Attendance Status
//               </Col>
//               <Col lg={2} className="px-4">
//                 Leave Type
//               </Col>
//               <Col lg={2} className="px-4">
//                 Leave Reason
//               </Col>
//               <Col lg={2} className="px-4">
//                 Status
//               </Col>
//               <Col lg={2} className="px-4"></Col>
//             </Row>
//             {generateDatesForCurrentMonth().map((date, index) => (
//               <Row className="g-0 pt-3" key={index}>
//                 <Col lg={2} className="px-4">
//                   <p>{date}</p>
//                 </Col>
//                 <Col lg={2} className="px-4">
//                   <label>
//                     <input
//                       type="radio"
//                       value="Present"
//                       checked={attendanceStatus[index] === "Present"}
//                       onChange={() =>
//                         handleAttendanceStatusChange(index, "Present")
//                       }
//                     />
//                     Present
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       value="Leave"
//                       checked={attendanceStatus[index] === "Leave"}
//                       onChange={() =>
//                         handleAttendanceStatusChange(index, "Leave")
//                       }
//                     />
//                     Leave
//                   </label>
//                 </Col>
//                 <Col lg={2} className="px-4">
//                   {attendanceStatus[index] === "Leave" ? (
//                     <select
//                       value={leaveType[index]}
//                       onChange={(e) =>
//                         handleLeaveTypeChange(index, e.target.value)
//                       }
//                     >
//                       <option value="Half Day">Half Day</option>
//                       <option value="Full Day">Full Day</option>
//                     </select>
//                   ) : (
//                     ""
//                   )}
//                 </Col>
//                 <Col lg={2} className="px-4">
//                   {attendanceStatus[index] === "Leave" ? (
//                     <textarea
//                       value={leaveReason[index]}
//                       onChange={(e) =>
//                         handleLeaveReasonChange(index, e.target.value)
//                       }
//                     />
//                   ) : (
//                     ""
//                   )}
//                 </Col>
//                 <Col lg={2} className="px-4">
//                   <p>Approve</p>
//                 </Col>
//                 <Col lg={2} className="px-4">
//                   <Button onClick={() => handleMarkAttendance(index)}>
//                     Mark Attendance
//                   </Button>
//                 </Col>
//               </Row>
//             ))}
//           </Table>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Attendance;
