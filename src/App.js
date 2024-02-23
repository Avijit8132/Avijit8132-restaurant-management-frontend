import logo from "./logo.svg";

import "./App.css";
import "./Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import { AccordionCollapse, Container } from "react-bootstrap";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import React, { useEffect, useState } from "react";

import EditProfile from "./components/EditProfile";
import ToDoList from "./components/ToDoFiles/ToDoList";
import ToDoCreate from "./components/ToDoFiles/ToDoCreate";
import ToDoView from "./components/ToDoFiles/ToDoView";
import TodoEdit from "./components/ToDoFiles/TodoEdit";

import PropertyList from "./components/inventory/PropertyList";

import * as constants from "./constants/CONSTANT";
import PropertyView from "./components/inventory/PropertyView";
import PropertyEdit from "./components/inventory/PropertyEdit";
import ChangePassword from "./components/ChangePassword";
import ReportView from "./components/ReportView";
import ReportList from "./components/ReportList";
import PubSub from "pubsub-js";
import { Toast, ToastContainer } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import Attendance from "./components/attendance/Attendance";
import MyDocument from "./components/MyDocument";
import LeadList from "./components/lead/LeadList";
import LeadEdit from "./components/lead/LeadEdit";
import LeadView from "./components/lead/LeadView";
import ContactList from "./components/contact/ContactList";
import ContactView from "./components/contact/ContactView";
import ContactEdit from "./components/contact/ContactEdit";
import SiteVisitList from "./components/siteVisit/SiteVisitList";
import SiteVisitEdit from "./components/siteVisit/SiteVisitEdit";
import SiteVisitView from "./components/siteVisit/SiteVisitView";
import DailyTaskList from "./components/dailyTask/DailyTaskList";
import DailyTaskEdit from "./components/dailyTask/DailyTaskEdit";
import DailyTaskView from "./components/dailyTask/DailyTaskView";
import Calendar from "./components/meeting/Calendar";
import UserEdit from "./components/user/UserEdit";
import UserList from "./components/user/UserList";
import UserView from "./components/user/UserView";
import SalePurchaseList from "./components/SalePurchaseList";
import OldLeadList from "./components/csv/OldLeadList";
import OldLeadView from "./components/csv/OldLeadView";
import LeadTaskList from "./components/LeadTaskList";
import PdfBuilder from "./components/PdfBuilder/PdfBuilder";
import data from "./components/NewJson";
import EnquirytableList from "./components/Enquirytable/EnquirytableList";
import EnquirytableView from "./components/Enquirytable/EnquirytableView";
import TableList from "./components/Table/TableList";
import TableEdit from "./components/Table/TableEdit";
import TableView from "./components/Table/TableView";
import BookingList from "./components/Booking/BookingList";
import BookingView from "./components/Booking/BookingView";
// import BookingEdit from "./components/Booking/BookingEdit";

function App() {
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState("Confirmation");
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [permissions, setPermissions] = useState();
  const [variant, setVariant] = useState("");
  const mySubscriber = (msg, data) => {
    switch (msg) {
      case "RECORD_SAVED_TOAST":
        setTitle(data.title);
        setMessage(data.message);
        setModalShow(true);
        setVariant("success");
        ////.log('mytopic: RECORD_SAVED_TOAST'); // add your desired log message
        break;
      case "RECORD_ERROR_TOAST":
        setTitle(data.title);
        setMessage(data.message);
        setModalShow(true);
        setVariant("danger");
        ////.log('mytopic: RECORD_ERROR_TOAST'); // add your desired log message
        break;
      default:
        ////.log('mytopic: default'); // add your desired log message
        break;
    }
  };
  useEffect(() => {
    PubSub.subscribe("RECORD_SAVED_TOAST", mySubscriber);
    PubSub.subscribe("RECORD_ERROR_TOAST", mySubscriber);

    try {
      if (localStorage.getItem("token")) {
        let user = jwt_decode(localStorage.getItem("token"));
        setUserInfo(user);

        var perm = user.permissions
          .map(function (obj) {
            return obj.name;
          })
          .join(";");
        setPermissions(perm);
      }
    } catch (error) {
      //.log(error);
    }
  }, []);

  return (
    <>
      <ToastContainer className="p-3" position="top-center">
        <Toast
          show={modalShow}
          onClose={() => setModalShow(false)}
          delay={3000}
          bg={variant}
          className="text-white"
          autohide
        >
          {variant === "success" ? (
            <div
              className="p-1 m-1"
              style={{ backgroundColor: "#198754", color: "white" }}
            >
              <i className="fa-regular fa-circle-check text-white mx-2"></i>
              <strong className="me-auto">{title}</strong>
              <i
                className="fa-solid fa-xmark text-white float-right"
                style={{ float: "right" }}
                role="button"
                onClick={() => setModalShow(false)}
              ></i>
            </div>
          ) : (
            <div
              className="p-1 m-1"
              style={{ backgroundColor: "#DC3545", color: "white" }}
            >
              <i className="fa-regular fa-circle-check text-white mx-2"></i>
              <strong className="me-auto">{title}</strong>
              <i
                className="fa-solid fa-xmark text-white float-right"
                style={{ float: "right" }}
                role="button"
                onClick={() => setModalShow(false)}
              ></i>
            </div>
          )}

          <Toast.Body>
            {message instanceof Array ? (
              message.map((item) => {
                return <span>{item.msg}</span>;
              })
            ) : message instanceof Object ? (
              <span>{message.detail}</span>
            ) : (
              <span>{message}</span>
            )}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <Home />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/meetings"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <Calendar />
                  </div>
                </div>
              </>
            }
          />
          {/* add wazid */}
          <Route
            path="/meetings/:today"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <Calendar />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="orders/:id/pdf"
            element={
              <>
                <div className="wrapper">
                  <div id="content"></div>
                </div>
              </>
            }
          />

          {/******** Edit Profile *******/}
          <Route
            path="/myprofile"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <EditProfile />
                  </div>
                </div>
              </>
            }
          />
          {/********My Document*******/}
          {/* <Route
            path="/mydoucoment/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <MyDocument />
                  </div>
                </div>
              </>
            }
          /> */}
           <Route
            path="/pdfbuilder/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                   <PdfBuilder propertyData={data} />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/contacts"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    {permissions &&
                    (permissions.indexOf(constants.VIEW_CONTACT) >= 0 ||
                      permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
                      <ContactList />
                    ) : (
                      "You have No permission for contact"
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="contacts/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ContactView />
                  </div>
                </div>
              </>
            }
            P
          />

          <Route
            path="/leads"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    {permissions &&
                    (permissions.indexOf(constants.VIEW_LEAD) >= 0 ||
                      permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
                      <LeadList />
                    ) : (
                      "You have no permission to access lead"
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/leadTaskList"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <LeadTaskList/>
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/properties"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    {permissions &&
                    (permissions.indexOf(constants.VIEW_PROPERTY) >= 0 ||
                      permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
                      <PropertyList />
                    ) : (
                      "You have no permission to access property"
                    )}
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/changepassword"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    {permissions &&
                    (permissions.indexOf(constants.VIEW_CONTACT) >= 0 ||
                      permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
                      <ChangePassword />
                    ) : (
                      "You have No permission for contact"
                    )}
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="properties/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <PropertyView />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/properties/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <PropertyEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/properties/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <PropertyEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="contacts/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ContactEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/leads/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <LeadEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/contacts/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ContactEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="leads/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <LeadView />
                  </div>
                </div>
              </>
            }
          />

          {/* ************Backup ********************/}

          <Route
            path="leads/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <LeadEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="reports/:id"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ReportView />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/reports"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ReportList />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <UserList />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/users/:id"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <UserView />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/users/e"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <UserEdit />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/users/:id/e"
            element={
              <>
                <div class="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <UserEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/attendance"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <Attendance />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/dailytasklist"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <DailyTaskList />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/dailytasklist/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <DailyTaskEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/dailytasklist/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <DailyTaskEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="dailytasklist/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <DailyTaskView />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/Todo"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ToDoList></ToDoList>
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/TodoNew"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ToDoCreate></ToDoCreate>
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/TodoView/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <ToDoView />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/Todoedit/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <TodoEdit></TodoEdit>
                  </div>
                </div>
              </>
            }
          />

          {/* /********* Income/Expense *********/}
          <Route
            path="/transactions"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <SalePurchaseList />
                  </div>
                </div>
              </>
            }
          />
          {/* /********* Data Mining *********/}
          <Route
            path="/importdata"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                   <OldLeadList/>
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="oldlead/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <OldLeadView/>
                  </div>
                </div>
              </>
            }
          />

          {/******** Site Visit *******/}

          <Route
            path="/sitevisit"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <SiteVisitList />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/sitevisit/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <SiteVisitEdit />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="sitevisit/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <SiteVisitView />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="sitevisit/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <SiteVisitEdit />
                  </div>
                </div>
              </>
            }
          />

           {/* /*********Enquiry Table *********/}
           <Route
            path="/enquiry"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                   <EnquirytableList></EnquirytableList>
                  </div>
                </div>
              </>
            }
          />
           <Route
              path="enquiry/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <EnquirytableView></EnquirytableView>
                  </div>
                </div>
              </>
            }
          />
    <Route
            path="/tables/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <TableEdit />
                  </div>
                </div>
              </>
            }
          />
<Route
            path="/table/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <TableEdit />
                  </div>
                </div>
              </>
            }
          />
<Route
            path="/tables"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                      <TableList /> 
                  </div>
                </div>
              </>
            }
          />


        <Route
            path="/tables/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <TableView />
                  </div>
                </div>
              </>
            }
            />
        <Route
            path="bookings/:id"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <BookingView />
                  </div>
                </div>
              </>
            }
          />
            <Route
            path="/bookings"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                      <BookingList/> 
                  </div>
                </div>
              </>
            }
            />
            </Routes>
      </Router>
    </>
  );
}

export default App;
