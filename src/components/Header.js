import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import jwt_decode from "jwt-decode";
import { HiOutlineMenu } from "react-icons/hi";
import PubSub from "pubsub-js";
import Notification from "./common/Notification";
import NotificationAlert from "./common/NotificationAlert/NotificationAlert";
import inventoryApi from "../api/inventoryApi";

// Use socketContext to get the socket connection
import { SocketContext } from "../socket";

const Header = (props) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [userImage, setUserImage] = useState("");
  const [modalshow, setModalshow] = useState(false);
  const [refreshedData, setRefreshData] = useState(true);
  const [allNotifications, setAllNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(Number(0));
  // use socketContext
  const socket = useContext(SocketContext);
  let bellButton = useRef();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");

    try {
      setUserInfo(jwt_decode(localStorage.getItem("token")));
      //.log(userInfo.username);
    } catch (error) {
      //.log(error);
    }
  }, []);

  useEffect(() => {
    ////.log("@@myimage " , localStorage.getItem("myimage"))
    //setUserImage(localStorage.getItem("myimage"));
    var dataImage = localStorage.getItem("myimage");
    let bannerImg = document.getElementById("profileimage");
    if (localStorage.getItem("myimage") !== "/img_avatar.png") {
      bannerImg.src = "data:image/png;base64," + dataImage;
    } else {
      bannerImg.src = localStorage.getItem("myimage");
    }

    //.log("RUN----");
  }, [localStorage.getItem("myimage")]);

  const [sidebar, setSidebar] = useState(false);
  const logout = () => {
    authApi.logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (sidebar === false) {
      setSidebar(true);
      ////.log(sidebar);
      document.querySelector("#sidebar").classList.toggle("active");
      //document.querySelector("#minisidebar").classList.toggle("active");
    } else {
      setSidebar(false);
      ////.log(sidebar);
      document.querySelector("#sidebar").classList.toggle("active");
      //document.querySelector("#minisidebar").classList.toggle("active");
    }
  };

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:
    let refershData = async (data) => {
      const result = await inventoryApi.fetchNotifications();
      if (result) {
        setAllNotifications(result);
      } else {
        setAllNotifications([]);
      }
      // //.log('data in refreshData function :>> ', data);
    };
    if (refreshedData) {
      setRefreshData(!refershData);
      refershData();
    }

    // subscribe to notification events
    //.log('inside useEffet :>> ');
    if (!modalshow) socket.on("notification_inserted", refershData);

    return () => {
      //.log('inside return :>> ');
      socket.off("notification_inserted", refershData);
    };
  }, [socket]);

  useEffect(() => {
    if (Object.keys(userInfo)?.length > 0 && allNotifications?.length > 0)
      setNotificationsCount(
        allNotifications.filter((data) => {
          return data.recipients[userInfo.id] === "notviewed";
        })?.length
      );
  }, [userInfo, allNotifications]);

  return (
    <>
      <Navbar className="header p-3" expand="lg" variant="">
        <button
          type="button"
          id="sidebarCollapse"
          className="btn btn-info"
          onClick={toggleSidebar}
        >
          {/* <i className="fas fa-align-left"></i> */}
          <HiOutlineMenu />
        </button>
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`/users/${userInfo.id}`} className="p-0" style={{ fontSize: ".9rem" }}>
              {/* <img src={'/img_avatar.png'} className="rounded-circle" style={{height: "30px"}}/>  */}
              <img
                src={userImage}
                className="rounded-circle"
                id="profileimage"
                style={{ height: "30px", border: "#1a1a1a53 0.25px solid" }}
              />
              <Badge style={{ fontSize: ".9rem" }} bg="light" text="dark">
                {userInfo.username}{" "}
              </Badge>
              <Badge style={{ fontSize: ".9rem", background: "#fa6469",padding:'4px' }} bg="">
                {userInfo.userrole}{" "}
              </Badge>{" "}
            </Nav.Link>
            <Nav.Link
              href="#"
              className="d-flex p-0"
              style={{ alignItems: "center" }}
            >
              <span className="mx-2" style={{ fontSize: ".9rem" }}>
                Company
              </span>{" "}
              <Badge style={{ fontSize: ".9rem", background: "#fa6469" }} bg="">
                {userInfo.companyname}{" "}
              </Badge>{" "}
            </Nav.Link>
          </Nav>

          <Nav className="ml-auto">
            <Nav.Link>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip className="my-tooltip">Notification</Tooltip>}
              >
                <Button
                  ref={bellButton}
                  variant="btn btn-primary position-relative"
                  onClick={() => setModalshow(!modalshow)}
                >
                  <i className="fa-solid fa-bell"></i>
                  {notificationsCount > 0 && (
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notificationsCount > 9 ? "9+" : notificationsCount}
                      <span class="visually-hidden">unread messages</span>
                    </span>
                  )}
                </Button>
              </OverlayTrigger>
            </Nav.Link>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip className="my-tooltip">Logout</Tooltip>}
            >
              {localStorage.getItem("token") ? (
                <Nav.Link href="/">
                  <Button variant="btn btn-primary" onClick={logout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </Button>
                </Nav.Link>
              ) : (
                <></>
              )}
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {modalshow && (
        <NotificationAlert
          show={modalshow}
          onHide={() => setModalshow(!modalshow)}
          bellButtonRef={bellButton}
          allNotifications={allNotifications}
          fetchNotifications={(data) => {
            setAllNotifications(data);
            if (data && data?.length === 0) {
              setNotificationsCount(Number(0));
            }
          }}
        />
      )}
    </>
  );
};

export default Header;
