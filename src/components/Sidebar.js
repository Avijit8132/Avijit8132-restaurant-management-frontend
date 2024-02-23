import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as constants from "../constants/CONSTANT";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const [permissions, setPermissions] = useState();
  const [userInfo, setUserInfo] = useState({});

  const location = useLocation();
  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        let user = jwt_decode(localStorage.getItem("token"));
        //.log("user:", user);
        setUserInfo(user);

        var perm = user.permissions
          .map(function (obj) {
            return obj.name;
          })
          .join(";");
        //.log("perm:", perm);
        setPermissions(perm);
      }
    } catch (error) {
      //.log(error);
    }
  }, []);
  return (
    <>
      <nav id="sidebar" className="">
        <div className="sidebar-header text-center">
          <div className="pb-1">
            <img src='/aa.png' />
          </div>
        </div>

        <ul
          className="list-unstyled components"
          style={{ borderTop: "1px solid #ddd" }}
        >
          {/* <li className={`${
                location.pathname.charAt(location.pathname.length - 1).includes("/") ? "active" : ""
              }`}>
            <Link to="/" >
              {" "}
              <i className="fa-solid fa-house mx-2 " ></i> Home
            </Link>
          </li> */}
           <li className={`${location.pathname.charAt(location.pathname.length - 1).includes("/") ? "active" : ""}`}>
              <Link to="/">
                {" "}
                <i  className={`fa-solid fa-house mx-2 ${location.pathname.charAt(location.pathname.length - 1).includes("/") ? "active" : "inactive"}`} ></i> Home
              </Link>
            </li>
     
          {/* {permissions &&
          (permissions.indexOf(constants.VIEW_LEAD) >= 0 ||
            permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
              <li className={`${location.pathname.includes("/leads") ? "active" : ""}`}>
              <Link to="/leads">
                {" "}
                <i className={`fa-solid fa-bolt mx-2 ${location.pathname.includes("/leads") ? "active" : "inactive"}`} ></i> Leads
              </Link>
            </li>
          ) : (
            ""
          )} */}
          
          {permissions &&
          (permissions.indexOf(constants.VIEW_CONTACT) >= 0 ||
            permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
            // <li
            //   className={`${
            //     location.pathname.includes("/contacts") ? "active" : ""
            //   }`}
            // >
            //   <Link to="/contacts">
            //     {" "}
            //     <i className="fa-solid fa-address-book mx-2"></i> Contacts
            //   </Link>
            // </li>
            <li className={`${location.pathname.includes("/contacts") ? "active" : ""}`}>
            <Link to="/contacts">
              {" "}
              <i  className={`fa-solid fa-address-book mx-2 ${location.pathname.includes("/contacts") ? "active" : "inactive"}`}></i> Contacts
            </Link>
          </li>
          ) : (
            ""
          )}

          {permissions &&
          (permissions.indexOf(constants.VIEW_PROPERTY) >= 0 ||
            permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
            <li
              className={`${
                location.pathname.includes("/tables") ? "active" : ""
              }`}
            >
              <Link to="/tables">
                {" "}
                <i  className={`fa-solid fa-building mx-2`}></i><span className={`fa-solid mx-2 ${location.pathname.includes("/tables") ? "active" : "inactive"}`}>Table</span>
              </Link>
            </li>
          ) : (
            ""
          )}
        
        {permissions &&
          (permissions.indexOf(constants.VIEW_PROPERTY) >= 0 ||
            permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
            <li
              className={`${
                location.pathname.includes("/bookings") ? "active" : ""
              }`}
            >
              <Link to="/bookings">
                {" "}
                <i  className={`fa-solid fa-building mx-2`}></i><span className={`fa-solid mx-2 ${location.pathname.includes("/bookings") ? "active" : "inactive"}`}>Booking</span>
              </Link>
            </li>
          ) : (
            ""
          )}

          {permissions &&
          ( permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
            <li
              className={`${
                location.pathname.includes("/users") ? "active" : ""
              }`}
            >
              <Link to="/users">
                {" "}
                <i className={`fa-solid fa-user mx-2 ${location.pathname.includes("/users") ? "active" : "inactive"}`} > </i> Users
              </Link>
            </li>
          ) : (
            ""
          )}

          {/* {permissions &&
          (permissions.indexOf(constants.MODIFY_ALL) >= 0) ? (
            <li
              className={`${
                location.pathname.includes("/reports") ? "active" : ""
              }`}
            >
              <Link to="/reports">
                {" "}
                <i className={`fa-solid fa-chart-simple mx-2 ${location.pathname.includes("/reports") ? "active" : "inactive"}`}> </i> Reports
              </Link>
            </li>
          ) : (
            ""
          )} */}
 
          <li
            className={`${
              location.pathname.includes("/myprofile") ? "active" : ""
            }`}
          >
            <Link to="/myprofile">
              {" "}
              <i className={`fa fa-user-circle mx-2 ${location.pathname.includes("/myprofile") ? "active" : "inactive"}`} ></i>My Profile
            </Link>
          </li>



          <li>
            <div
              className="mx-4 mt-4"
              style={{  color: "#fff", textAlign: "center" }}
            >
              <img
                style={{ width: "200px", paddingTop: "1rem" }}
                src="/restaurant.webp "
              />
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
