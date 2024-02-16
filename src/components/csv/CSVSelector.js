import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import MappingFields from "./MappingFields";
import inventoryApi from "../../api/inventoryApi";
import PubSub from "pubsub-js";
import Table from "react-bootstrap/Table";
import { Link, redirect, useNavigate } from "react-router-dom";
import FileUpload from "../FileUpload";
import { CSVLink } from "react-csv";
import papaParse from "papaparse"
import * as XLSX from "xlsx"

const CSVSelector = (props) => {

  const [mapFieldsShow, setMapFieldsShow] = useState();
  const [csvData, setCSVData] = useState();
  const tableValue = [
    { unique: "actions", label: "actions" },
    { unique: "leadid", label: "leadid" },
    { unique: "clientname", label: "clientname" },
    { unique: "leadcreateddate", label: "leadcreateddate" },
    { unique: "leadstatus", label: "leadstatus" },
    { unique: "leadstagestatus", label: "leadstagestatus" },
    { unique: "area", label: "area" },
    { unique: "leadageing", label: "leadageing" },
    { unique: "verticaltypes", label: "verticaltypes" },
    { unique: "verticallocation", label: "verticallocation" },
    { unique: "requirementzone", label: "requirementzone" },
    { unique: "remarks", label: "remarks" },
    // { unique: "productcategory_name", label: "product category" },
  ];
  const [csvDataAligned, setCSVDataAligned] = useState();
  const [dataForInsert, setDataForInsert] = useState();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileRequiredError, setFileRequiredError] = useState(false);
  const [csvReport, setCSVReport] = useState({ data: [], header: [] });
  const [finalRecords, setFinalRecords] = useState([])
  const exportButon = useRef();
  
  async function handleFileChange(e) {

    //.log("file details --> ",e.target.files[0]);
    
    const fileDetails = e.target.files[0];

    if(fileDetails.name.endsWith(".csv")){

      papaParse.parse(e.target.files[0], {
        
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          
          // //.log("papaParse csv result --> ",result)
          //.log("papaParse csv data --> ",result.data)

          if(result.data.length>0){
            setFinalRecords(()=>result.data)
          }
        }
        
      })
    }
    else if(fileDetails.name.endsWith(".xls") || fileDetails.name.endsWith(".xlsx")){

      const reader = new FileReader();
      reader.readAsBinaryString(fileDetails)

      reader.onload = (e) => {

        const data = e.target.result
        const workbook = XLSX.read(data, { type: "binary",cellDates: true})
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const parsedData = XLSX.utils.sheet_to_json(sheet,{raw: false, dateNF: 'yyyy-dd-mm HH:mm:ss'});
        //.log("XLSX excel data --> ",parsedData);
        if(parsedData.length>0){
          setFinalRecords(()=>parsedData)
        }
      }

    }


    if (e.target.files) {
      try {
        const file = e.target.files[0];
        // setSelectedFile(e.target.files[0]);
        if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))) {
          setSelectedFile(file);
          setFileRequiredError(false);
        } else {
          setSelectedFile(null);
          setFileRequiredError("Please select a valid CSV or Excel file.");
        }

        // // 1. create url from the file
        // const fileUrl = URL.createObjectURL(file);

        // // 2. use fetch API to read the file
        // const response = await fetch(fileUrl);

        // // 3. get the text from the response
        // const text = await response.text();

        // // 4. split the text by newline
        // const lines = text.split("\n");

        // // 5. map through all the lines and split each line by comma.
        // const _data = lines.map((line) => line.split(","));
        // setCSVData(_data);
        // var temp = [];
        // _data[0].map((e) => {
        //   temp.push({
        //     edit:
        //       tableValue.filter((ele) => ele.unique === e).length > 0
        //         ? true
        //         : false,
        //     mappedFields:
        //       tableValue.filter((ele) => ele.unique === e).length > 0 ? (
        //         e
        //       ) : (
        //         <p style={{ color: "red" }}>Unmapped *</p>
        //       ),
        //     csvHeader: e,
        //   });
        // });

        // setCSVDataAligned(temp);
        // var tempList = [];
        // _data.map((data, index) => {
        //   var temp = {};
        //   if (index !== 0 && _data.length - 1 !== index) {
        //     _data[0].map((e, index) => {
        //       temp = { ...temp, [e]: data[index].trim() };
        //     });
        //     tempList.push(temp);
        //   }
        // });
        // //.log("tempList", tempList);
        // setDataForInsert(tempList);

        // // 6. call the onChange event
        // // onChange(_data);
      } catch (error) {
        //.error(error);
      }
    } else {
      setFileRequiredError("please select file");
    }
  }

  const importFileData = async () => {

    //.log("inside import data");

    let result = await inventoryApi.csvExcelLeadImport(finalRecords);
    if (result.success) {
      PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Records imported successfully' });
      props.fetchData();
      props.onHide();
    }
    else{
      PubSub.publish('RECORD_ERROR_TOAST', { title: 'Error', message: result.message});
    }
  }

  async function SubmitForm() {
    let tempList = [...dataForInsert];
    //.log("templist", tempList);
    csvDataAligned.map((e) => {
      if (e.edit === true) {
        tempList.map((ele) => {
          if (ele[e.mappedFields] !== ele[e.csvHeader]) {
            ele[e.mappedFields] = ele[e.csvHeader];
            delete ele[e.csvHeader];
          }
        });
      } else {
        tempList.map((ele) => {
          delete ele[e.csvHeader];
        });
      }
    });
    //.log("dataForInsert", dataForInsert);
    // let result = await SparkApi.createProductWithCSV(dataForInsert)
    //   .then((result) => {
    //     setCSVReport({
    //       data: result.data,
    //       headers: [{ label: "Product Name", key: "product_name" },{ label: "Is Active", key: "is_active" },{label: "Product Category", key: "productcategory_name" },{ label: "Message", key: "message" }],
    //       filename: "Clue_Mediator_Report.csv",
    //     });
    //     return result;
    //   })
    //   .catch((e) => //.log(e));
    // //.log("result", result);

    // if (!result.error) {
    //   const timer = setTimeout(() => {
    //     exportButon.current.link.click();
    //     PubSub.publish("RECORD_SAVED_TOAST", {
    //       title: "Record Saved",
    //       message: "Record saved successfully",
    //     });
    //     props.onHide();
    //     navigate(`/products/`);
    //   }, 1000);
   

    // } else {
    //   PubSub.publish("RECORD_SAVED_TOAST", {
    //     title: "Not Created",
    //     message: result.error,
    //   });
    //   navigate(`/products/`);
    // }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Import CSV / Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        {!mapFieldsShow && (
          <>
            <div className="requiredbox">
              {/* <div className=""> */}
                <h6>Required Headers : &nbsp;</h6>
                <div className="row">
                  
                {tableValue.map((item, index) => (
                  <div
                    key={index}
                    style={{ paddingLeft: "1.5rem" }}
                    className={"col-md-4"}
                  >
                    <span>
                      {index + 1}.
                      &nbsp;&nbsp;
                      {item.label}{" "}
                    </span>
                  </div>
                ))}
                </div>
              {/* </div> */}
              <div style={{paddingTop: "2rem"}}>
                <h6>Example : &nbsp;<Link style={{color: "blue"}} className="download-csv" to="/demo csv.csv" target="_blank" download>click here</Link> to download demo file</h6>
              <br />
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>leadid</th>
                      <th>clientname</th>
                      <th>leadcreateddate</th>
                      <th>leadstatus</th>
                      <th>area</th>
                      <th>verticaltypes</th>
                      <th>remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>12345</td>
                      <td>Test Client</td>
                      <td>01/01/2024</td>
                      <td>Closed - Converted</td> 
                      <td>100</td>
                      <td>test</td>
                      <td>test remark</td>
                    </tr>
                    <tr>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <br />
            <h6>Upload CSV / Excel :</h6>
            {/* <input type="file" accept=".csv" onChange={handleFileChange} /> */}
            <div>
              <FileUpload
                required={fileRequiredError}
                changed={(e) => handleFileChange(e)}
              />
              <br />
              <b className="red-star">{fileRequiredError}</b>
              <h6>
                Selected File: &nbsp;{" "}
                {selectedFile ? selectedFile.name : "No file selected."}
              </h6>
            </div>
          </>
        )}
        {mapFieldsShow && (
          <MappingFields
            fields={tableValue}
            csvDataAligned={csvDataAligned}
            onUpdate={(e) => {
              //.log("stSA", e);
              setCSVDataAligned(e);
            }}
          />
        )}
        <div style={{ visibility: "hidden" }}>
          {
            <CSVLink {...csvReport} ref={exportButon}>
              Export to CSV
            </CSVLink>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        {!mapFieldsShow && selectedFile && (
          <Button variant="success" onClick={() => importFileData()}>
            Import
          </Button>
        )}
        {mapFieldsShow && (
          <Button variant="success" onClick={() => SubmitForm()}>
            Start Import
          </Button>
        )}
        <Button onClick={props.onHide} variant="light">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CSVSelector;
