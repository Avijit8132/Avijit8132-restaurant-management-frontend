import React, { useEffect, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import { Table } from "react-bootstrap";

const ReportPDF = (props) => {
  const [reportBody, setReporttest] = useState(
    props.reports ? props.reports : []
  );
  const [reportHeader, setReportHeader] = useState(
    props.headers ? props.headers : []
  );
  // const[leadinfo, setLeadinfo] = useState([]);
  let fields = props.fields;
  let values = props.values;
  let header = props.arrName;
  //.log("header", header);
  //.log("fields", fields);
  useEffect(() => {
    //.log("props.header", props.headers);
    //.log("report", props.report);
    if (props?.reports) {
      setReporttest(props?.reports);
      setReportHeader(props.headers);
    }
  }, [props.refresh]);

  return (
    <div>
      <Table striped bordered hover style={{ fontSize: "10px" }}>
        <thead>
          <tr>
            {reportHeader.map((data, index) => (
              <th>{data.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportBody.map(
            (data, index) =>
              props.report.name === "All Contacts" && (
                <tr key={index}>
                  {/* <td>{data.salutation}</td> */}
                  <td>{data.type_count}</td>
                  <td>{data.fullname}</td>
                  {/* <td>{data.lastname}</td> */}
                  <td>{data.title}</td>
                  <td>{data.type}</td>
                  <td>{data.email}</td>
                  <td>{data.phone}</td>
                  <td>{data.address}</td>
                  {/* <td>{data.company}</td> */}
                  {/* <td>{data.street}</td>
                  <td>{data.city}</td>
                  <td>{data.state}</td> */}
                  {/* <td>{data.country}</td> */}
                  {/* <td>{data.pincode}</td> */}
                </tr>
              )
          )}
          {reportBody.map(
            (data, index) =>
              props.report.name === "All Expense" && (
                <tr key={index}>
                  <td>{data.title}</td>
                  <td>{data.type}</td>
                  <td>{data.category}</td>
                  <td>{data.amount}</td>
                  <td>{data.transactiondate}</td>
                  <td>{data.description}</td>
                </tr>
              )
          )}
          {reportBody.map(
            (data, index) =>
              props.report.name ===
                "Current Year Income Expense Month Wise" && (
                <tr key={index}>
                  {/* select  CAST (SUM(amount) AS FLOAT) AS totalAmount, type, TO_CHAR(DATE(createddate), 'Month') CreatedMonth, DATE_TRUNC ('month', createddate) createddate  from ibs_ibirds.transaction
WHERE extract(year from createddate)='2023'
group by type, TO_CHAR(DATE(createddate), 'Month'), DATE_TRUNC ('month', createddate) 
order by DATE_TRUNC ('month', createddate) */}

                  <td>{data.totalamount}</td>
                  {/* {//.log('totalAmount')} */}
                  <td>{data.type}</td>
                  <td>{data.createdmonth}</td>
                  <td>{data.createddate}</td>
                  {/* <td>{data.landmark}</td>
                            <td>{data.requirment}</td>
                            <td>{data.owner_name}</td>
                            <td>{data.amount}</td> */}
                </tr>
              )
          )}
          {reportBody.map(
            (data, index) =>
              props.report.name === "Area Wise Property Report" && (
                <tr key={index}>
                  <td>{data.count}</td>
                  <td>{data.city}</td>
                  <td>{data.state}</td>

                  {/* <td>{data.amount}</td>
                            <td>{data.phone}</td>
                            <td>{data.street}</td>
                            <td>{data.city}</td>
                            <td>{data.othercity}</td>
                            <td>{data.Location}</td>
                            <td>{data.state}</td> */}
                </tr>
              )
          )}
          <div style={{ fontSize: "6px" }}>
            {reportBody.map(
              (data, index) =>
                props.report.name === "All Income" && (
                  <tr key={index}>
                    <td>{data.title}</td>
                    <td>{data.type}</td>
                    <td>{data.category}</td>
                    {/* <td>{data.Lead_Type}</td> */}
                    <td>{data.amount}</td>
                    <td>{data.transactiondate}</td>
                    <td>{data.description}</td>
                    {/* <td>{data.remarks}</td>
                                <td>{data.amount}</td> */}
                  </tr>
                )
            )}
          </div>

          {reportBody.map(
            (data, index) =>
              props.report.name === "Not Contacted call records" && (
                <tr key={index}>
                  <td>{data.Visit_Date}</td>
                  <td>{data.Client_Name}</td>
                  <td>{data.owner_name}</td>
                  <td>{data.Lead_Type}</td>
                  <td>{data.phone}</td>
                  <td>{data.requirment}</td>
                  <td>{data.city}</td>
                  <td>{data.othercity}</td>
                  <td>{data.amount}</td>
                </tr>
              )
          )}

          {reportBody.map(
            (data, index) =>
              props.report.name === "Contact Type Count Report" && (
                <tr key={index}>
                  <td>{data.contact_type}</td>
                  <td>{data.contact_type_name}</td>
                  {/* <td>{data.Client_Name}</td>
                  <td>{data.Lead_Type}</td>
                  <td>{data.project}</td>
                  <td>{data.phone}</td>
                  <td>{data.city}</td>
                  <td>{data.requirment}</td>
                  <td>{data.amount}</td> */}
                </tr>
              )
          )}

          {/* {reportBody.map((data, index) => (
                        props.report.name === 'Project Stage Count Report' && (<tr key={index}>

                            <td>{data.Visit_Date}</td>
                            <td>{data.amount}</td>
                            <td>{data.Lead_Type}</td>
                            <td>{data.project}</td>
                            <td>{data.Count}</td>
                        </tr>

                        )))} */}

          {reportBody.map(
            (data, index) =>
              props.report.name === "Intrested Property Count Report" && (
                <tr key={index}>
                  <td>{data.property_count}</td>
                  <td>{data.intrested_property_name}</td>
                  {/* <td>{data.Client_Name}</td>
                  <td>{data.Lead_Type}</td>
                  <td>{data.product}</td>
                  <td>{data.phone}</td>
                  <td>{data.Location}</td>
                  <td>{data.description}</td>
                  <td>{data.amount}</td> */}
                </tr>
              )
          )}
          {reportBody.map(
            (data, index) =>
              props.report.name === "Leads Interested Property Report" && (
                <tr key={index}>
                  <td>{data.property_count}</td>
                  <td>{data.fullname}</td>
                  <td>{data.title}</td>
                  <td>{data.intrested_property_name}</td>
                  <td>{data.intrested_location}</td>
                  <td>{data.phone}</td>
                  <td>{data.company}</td>
                  <td>{data.assign_staff}</td>
                  <td>{data.address}</td>
                </tr>
              )
          )}
          <tr style={{ border: "None" }}>
            {reportHeader?.map(
              (data, dataIndex) => (
                <td key={dataIndex}></td>
              ) // A
            )}
          </tr>
          {props.report &&
            props.report.summarymethod &&
            props.report.summaryfield &&
            fields &&
            fields.length > 0 && (
              <tr style={{ border: "None" }}>
                {header?.map((data, dataIndex) =>
                  fields.includes(data) ? (
                    <td key={dataIndex}>Total : {values[data]}</td>
                  ) : (
                    <td key={dataIndex}></td> // Add an empty cell if the field is not present in the data
                  )
                )}
              </tr>
            )}
        </tbody>
      </Table>
    </div>
  );
};
export default ReportPDF;
