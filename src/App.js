import logo from "./logo.svg";

import "./App.css";
import "./Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import React, { useEffect, useState } from "react";
import EditProfile from "./components/EditProfile";
import * as constants from "./constants/CONSTANT";
import ChangePassword from "./components/ChangePassword";
import ReportView from "./components/ReportView";
import ReportList from "./components/ReportList";
import PubSub from "pubsub-js";
import { Toast, ToastContainer } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import ContactList from "./components/contact/ContactList";
import ContactView from "./components/contact/ContactView";
import ContactEdit from "./components/contact/ContactEdit";
import UserEdit from "./components/user/UserEdit";
import UserList from "./components/user/UserList";
import UserView from "./components/user/UserView";
import TableList from "./components/Table/TableList";
import TableEdit from "./components/Table/TableEdit";
import TableView from "./components/Table/TableView";
import BookingList from "./components/Booking/BookingList";
import BookingView from "./components/Booking/BookingView";
import BookingEdit from "./components/Booking/BookingEdit";

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
            path="/booking/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <BookingEdit />
                  </div>
                </div>
              </>
            }
          />
            <Route
            path="/bookings/:id/e"
            element={
              <>
                <div className="wrapper">
                  <Sidebar />
                  <div id="content">
                    <Header />
                    <BookingEdit />
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
