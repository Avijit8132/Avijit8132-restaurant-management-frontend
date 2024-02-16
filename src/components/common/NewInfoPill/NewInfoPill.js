// Created by sri vignesh

import React from "react";
import "./NewInfoPill.css";

const NewInfoPill = ({ left, right }) => {
  return (
    <div className="info-pill-container">
      <span className="info-pill-first-section">{left} </span>
      <span className="info-pill-second-section">{right}</span>
    </div>
  );
};

export default NewInfoPill;
