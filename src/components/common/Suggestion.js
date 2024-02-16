import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";


const Suggestion = (props) => {


    const selectSuggestion = (username) => {
        const regexp = /@[a-zA-Z0-9]*$/;
        const newValue = props.inputValue.replace(regexp,username + ' ');
        props.applyMention({target: {value: newValue}}); // THIS MIMICS AN ONCHANGE EVENT
        props.focusInput();
      }

    const suggestionItems = props.suggestionList.map((item) => {
        // return <div className="item" onClick={()=>selectSuggestion('@' + item)}>@{item}</div>
        return <div className="item">{item.name}</div>
    }
  );
    useEffect(() => {

    }, []);


    return (


        <div style={{border: "1px solid silver", width: "150px"}}>
       {suggestionItems}
      </div>
    )
}
export default Suggestion;
