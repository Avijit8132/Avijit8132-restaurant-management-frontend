import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";


const Path = (props) => {
    const [values, setValues] = useState(props.values ? props.values : []);
    ////.log('values', values)
    const [selectedValue, setSelectedValue] = useState(props.selectedValue ? props.selectedValue : '');

    useEffect(() => {

    }, []);

    const getClassName = (currentVal, selectedVal) => {

        if (currentVal.label === selectedVal) {
               return "bar-step completed current";
        }
        else if (values.findIndex(val => val.label === currentVal.label) < values.findIndex(val => val.label === selectedVal) && currentVal.is_lost === false && currentVal.is_converted === false) {
            if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Open')
            return "bar-step completed stage1";
            else   if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Pending')
            return "bar-step completed stage2";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Negotiation Stage')
            return "bar-step completed stage3"
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Due Diligence Stage')
                return "bar-step completed stage4";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Upload File Stage')
                return "bar-step completed stage5";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Tenure')
                return "bar-step completed stage6";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Neighboring Brands')
                return "bar-step completed stage7";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Stamp Duty')
                return "bar-step completed stage8";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Registration Cost')
                return "bar-step completed stage9";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Maintenance Charges')
                return "bar-step completed stage10";
            else if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Possession Timeline')
                return "bar-step completed stage11";
            else   if (currentVal.is_lost || currentVal.is_converted || currentVal.label === 'Close')
            return "bar-step completed stage12";
            
        } else {
            return "bar-step ";
        }

    }

    return (


        <>
            <div class="bar">

                {values.map((val) => {
                    return <div className={
                        getClassName(val, selectedValue)
                    }>{val.label}</div>
                })}

            </div>
        </>
    )
}
export default Path;
