import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import inventoryApi from "../../api/inventoryApi";
import { MentionsInput, Mention } from 'react-mentions'
import jwt_decode from "jwt-decode";
import mentionsInputStyle from "./mentionsInputStyles";
import parse from 'html-react-parser';

const Chat = ({ parentid }) => {
  const [inputTxt, setInputTxt] = useState("");
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userInfo,setUserInfo] = useState();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(360);
  useEffect(() => {
    setUserInfo(jwt_decode(localStorage.getItem('token')));
    messageList();
    fetchUsers(); 
    //.log('users');
  }, [rotationDegrees]);

   

  const fetchUsers = () =>{
    async function init() {
        let users = await inventoryApi.fetchUsers();
        
        if (users && users?.length > 0) {
            let result = users.map(a => {
                return {"id" : a.id, "display": a.username}
            });
            //.log('result', result);
            setUserList(result);
        } else {
            setUserList([]);
        }
      }
      init();
  }
  const parser = (markup) => {
    return [...markup.matchAll(/@\[(.*?)]\((.*?)\)/g)]
    .reduce((a, v) => {
      
      let res = {id: v[2], username: v[1]};
      return res
    }, {})
  }
  const messageList = () =>{
    async function init() {
        let tasks = await inventoryApi.fetchMessages(parentid);
        //.log("tasks", tasks);
        //.log(tasks);
        let modified = [];
        if (tasks && tasks?.length > 0) {
          tasks.forEach(function(variable){
          let  markup = variable.description;
          let data = parser(markup);
          //.log('data',data?.id, jwt_decode(localStorage.getItem('token'))?.id)
          if(jwt_decode(localStorage.getItem('token'))?.id === data.id || data?.id === undefined || variable.createdbyid === jwt_decode(localStorage.getItem('token'))?.id ){
            if(data.username)
              markup= markup.replace('@[' + data.username + ']', '<a href=/users/'+data.id +'>' + data.username + '</a>');
            
            if(data.id)
              markup= markup.replace('(' + data.id + ')', ' ');

            //.log('markup ', markup)
            modified.push({...variable, ['description'] : markup })
          }  
          });
          //.log('modified', modified)
          setMessages(modified);
        } else {
          setMessages([]);
        }
      }
      init();
  };

  const inputChange = (e) => {

    //.log(e)
    setInputTxt(e.target.value);
  };

  const sendMessage = async (e) => {
    if (inputTxt.trim().length > 0) {
      const result = await inventoryApi.createMessage({
        parentid: parentid,
        description: inputTxt,
      });
      if (result) {
        messageList();
        setInputTxt("");
      }
    }
  };

  const deleteMessage = async (recid) => {
    //.log("dleete")
      const result = await inventoryApi.deleteMessage(recid);
      messageList();
    
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
  }

  const toggleSpin = () => {
    setIsSpinning(!isSpinning);
    setRotationDegrees(rotationDegrees + 360);
  };

  const iconStyle = {
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'transform 0.7s ease-in-out',
    transform: `rotate(${rotationDegrees}deg)`
  };
  
  return (
    <>
      <Row className="view-form-header align-items-center">
        <Col
          lg={12}
          className="d-flex align-items-center justify-content-between"
        >
          <span style={{ border: "0", padding: ".2rem" }}>
          <i class="fa-solid fa-comment" style={{color: "#ffbe00"}}></i> Notes & Messages
          </span>
          <i className="fas fa-rotate-right" style={iconStyle} onClick={toggleSpin}></i>
        </Col>
      </Row>
      <Row className="">
        <div className="chat pb-2">
        <div className="w-100 mt-2  chat-input-group text-right">
         
         {/* <input
           ref={inputRef}
           type="text"
           style={{ height: "2.5rem", width: "100%" }}
           value={inputTxt}
           onChange={inputChange}
           className="chat-input"
           onKeyDown={handleKeyDown} 
         /> */}

{/* <TextInput options={userList} 
style={{width: "100%" }}
value={inputTxt}
onChange={inputChange}
className="chat-input"
// onKeyDown={handleKeyDown} 

/> */}

<MentionsInput value={inputTxt} onChange={inputChange}
style={mentionsInputStyle} 
placeholder="Share your message..."
>
  <Mention
    trigger="@"
    data={userList}
    style={{backgroundColor: "#cee4e5"}}
    displayTransform={(id, display) => "@" + (display)}
  />

</MentionsInput>
      
         <button className="sendbtn mt-2" type="button" onClick={sendMessage} >
         <i class="fa-regular fa-paper-plane"></i> Send
         </button>

       
       </div>
       <div className="chatScroll" style={{ maxHeight: "157px", overflowY: "auto"}}>
          {messages &&
            messages.map((item) => (
              <div
                style={{
                  paddingLeft: ".2rem",
                  paddingTop: ".5rem",
                  backgroundColor: "beige",
                  borderRadius: "5px",
                  padding: "1rem",
                  marginTop: ".5rem",
                  marginBottom: ".5rem",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                <div
                  style={{
                    fontSize: "smaller",
                    borderBottom: "1px solid #17191c33",
                    paddingBottom: ".2rem",
                    marginBottom: ".5rem",
                  }}
                >
                  <span
                    className="d-inline"
                    style={{
                      border: "none",
                      color: "#e6e6e6",
                      fontSize: "1rem",
                      color: "#645721",
                    }}
                  >
                    {item.createdbyname}{" "}
                  </span>{" "}
                  <span
                    className="d-inline"
                    style={{
                      paddingLeft: "1rem",
                      color: "#645721",
                      fontSize: ".8rem",
                      border: "none",
                    }}
                  >
                    {item.date}
                  </span>
                </div>{" "}
               { item.createdbyid === userInfo.id &&  <i
                  class="fa-solid fa-trash-can"
                  style={{ color: "tomato", cursor: "pointer" }}
                  onClick={(e) => deleteMessage(item.id)}
                ></i>}
                </div>
                <div>{parse(item.description)} </div>
              </div>
            ))}

          {(!messages || messages.length === 0) && (
            <div
              style={{
                paddingLeft: ".2rem",
                paddingTop: ".5rem",
                backgroundColor: "beige",
                borderRadius: "5px",
                padding: "1rem",
                marginTop: ".5rem",
                marginBottom: ".5rem",
              }}
            >
              No messages
            </div>
          )}

</div>
        
       
        
      
        </div>
      </Row>
    </>
  );
};
export default Chat;
