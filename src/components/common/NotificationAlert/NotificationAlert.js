import React, { useContext, useEffect, useRef } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import jwt_decode from "jwt-decode";
import Nav from "react-bootstrap/Nav";
import inventoryApi from "../../../api/inventoryApi";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SocketContext } from "../../../socket";
import "./NotificationAlert.css";
import { useNavigate } from "react-router-dom";

const NotificationAlert = ({
  show,
  onHide,
  bellButtonRef,
  allNotifications,
  fetchNotifications,
}) => {
  const [userInfo, setUserInfo] = useState({});
  const [fetchNewNotifications, setFetchNewNotifications] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    allNotifications.length > 0 ? allNotifications : []
  );
  const socket = useContext(SocketContext);
  let notificationBox = useRef();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserInfo(jwt_decode(localStorage.getItem("token")));
    }
  }, []);

  const handleReadNotification = async (id) => {
    //.log("inside read notification", id)
    const result = await inventoryApi.readNotification(id);
    setNotifications(result);
    fetchNotifications(result);
  };

  const handleDeleteNotification = async (id) => {
    //.log("inside delete notification", id)
    const result = await inventoryApi.deleteNotification(id);
    setFetchNewNotifications(!fetchNewNotifications);
  };

  const handleClearAll = async () => {
    const result = await inventoryApi.clearAllNotification();
    setFetchNewNotifications(!fetchNewNotifications);
  };

  useEffect(() => {
    let handler = (e) => {
      if (
        !bellButtonRef.current.contains(e.target) &&
        !notificationBox.current.contains(e.target)
      )
        onHide(false);
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:
    let refershData = async (data) => {
      const result = await inventoryApi.fetchNotifications();
      if (result) {
        setNotifications(result);
        fetchNotifications(result);
      } else {
        setNotifications([]);
        fetchNotifications([]);
      }
      // //.log('data in refreshData function :>> ', data);
    };

    if (fetchNewNotifications) {
      refershData();
      setFetchNewNotifications(!fetchNewNotifications);
    }

    if (show) socket.on("notification_inserted", refershData);

    return () => {
      socket.off("notification_inserted", refershData);
    };
  }, [socket, fetchNewNotifications]);

  return (
    <div className="notification-area" ref={notificationBox}>
      <Alert
        show={show}
        variant="light"
        onClose={() => onHide(false)}
        dismissible
        className="alert-border"
      >
        <Alert.Heading>Notifications</Alert.Heading>
        <hr />
        <div className="notifications-container">
          {notifications.length > 0 ? (
            <TransitionGroup>
              {notifications.map((data, index) => (
                <CSSTransition
                  in={true}
                  key={data.id}
                  timeout={450}
                  classNames="item"
                >
                  <ListGroup.Item>
                    {/* Each notification record */}
                    <div
                      key={index}
                      className={
                        "d-flex flex-column " +
                        data.recipients[
                          userInfo.id
                        ] /* === "notviewed" ? 'notification-box-not-viewed' : 'notification-box-viewed' */
                      }
                    >
                      {/* title, icons - first line */}
                      <div className="d-flex flex-row pb-1">
                        {/* title */}
                        <strong className="text-truncate">{data.title}</strong>
                        {/* icons */}
                        <span className="ml-auto">
                          {data.recipients[userInfo.id] === "notviewed" ? (
                            // un read icon if notification is not viewed
                            <i
                              class="fa fa-envelope-o fa-xl position-relative custom-icon"
                              onClick={() => handleReadNotification(data.id)}
                            >
                              <span
                                style={{ marginTop: "-5px" }}
                                class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                              ></span>
                            </i>
                          ) : (
                            // read icon
                            <i class="fa-regular fa-envelope-open fa-xl custom-icon"></i>
                          )}
                          &nbsp;&nbsp;
                          {/* delete icon */}
                          <i
                            class="fa-solid fa-trash fa-lg custom-icon"
                            onClick={() => handleDeleteNotification(data.id)}
                          ></i>
                        </span>
                      </div>
                      {/* description */}
                      <div className="col pb-1 text-truncate">
                        {data.description}
                      </div>
                      {/* {console.log('data.navigationlink',data.navigationlink)} */}
                      {data.navigationlink && (
                        <div
                          className="col pb-1 "
                          onClick={() => {
                            navigate(data.navigationlink);
                            onHide();
                          }}
                        >
                          <Nav.Link href={data.navigationlink}>
                            <u>
                            Open Record&nbsp;&nbsp;
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </u>
                          </Nav.Link>
                        </div>
                      )}
                      <div className="col pb-1 sent-by-and-date">
                        Sent by {data.createdbyname} On&nbsp;
                        {moment(data.createddate).format("Do MMM YY, h:mm A")}
                      </div>
                    </div>
                  </ListGroup.Item>
                </CSSTransition>
              ))}
            </TransitionGroup>
          ) : (
            <div className="p-3 ml-auto text-center">
              No New Notifications !
            </div>
          )}
        </div>
        <hr />
        <div className="p-3 d-flex justify-content-end">
          {notifications.length > 0 && (
            <Button onClick={() => handleClearAll()} variant="outline-success">
              Clear All
            </Button>
          )}
          <Button
            className="ms-2"
            onClick={() => onHide(false)}
            variant="outline-success"
          >
            Close
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default NotificationAlert;
