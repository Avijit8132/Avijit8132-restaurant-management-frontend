import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import inventoryApi from '../../api/inventoryApi';
import * as constants from "../../constants/CONSTANT"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import {
  DatatableWrapper,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Button, Container, Modal, Col, Row, Table } from 'react-bootstrap';
import Image from "react-bootstrap/Image";
import moment from 'moment';

const SelectInventoryFiles = ({ show, onHide, confirmFiles }) => {

  // const [allInventories, setAllInventories] = useState([]);
  const [inventSelectedFiles, setInventSelectedFiles] = useState([])

  useEffect(() => {
    filesList();
  }, [])

  const filesList = () => {

    async function init() {
      let files = await inventoryApi.fetchLeadEmailFiles();

      if (files.length > 0) {

        // setAllInventories(files)

        setInventSelectedFiles(
          files.map((inventory) => {

            let updatedPdfFiles = []

            if (inventory.PdfFiles.length > 0) {
              (inventory.PdfFiles.forEach((file) => { updatedPdfFiles.push({ ...file, isSelected: false }) }))
            }
            return { ...inventory, PdfFiles: updatedPdfFiles }
          }))
    }}

    init();
  };

  const handleSelectFile = (row) => {

    //.log("selected file --> ",row);

    setInventSelectedFiles((prev) =>
      prev.map((inventory) => {

        let updatedPdfFiles = []

        if (inventory.PdfFiles.length > 0) {
           (inventory.PdfFiles.forEach((file) => {
            
            file.id === row.id ? updatedPdfFiles.push({ ...file, isSelected: !file.isSelected }) 
            : updatedPdfFiles.push(file)
          }))}
        return {...inventory, PdfFiles: updatedPdfFiles}
      }))
  }

const handleNext = () => {

  let localSelectedFiles = []

  inventSelectedFiles.forEach((inventory) => {
    if (inventory.PdfFiles.length > 0) {
      (inventory.PdfFiles.forEach((file) => {
       
       if(file.isSelected) localSelectedFiles.push(file) 
     }))}
  })

  //.log("All selected files --> ",localSelectedFiles);
  
  confirmFiles(localSelectedFiles);
}

const fileSize = (bytes) => {
  var exp = bytes / 1024 / 1024;
  return exp.toFixed(2) + " MB";
};

const renderPreview = (type, body) => {
  ////.log(type);
  switch (type) {
    case constants.PDF:
      return <i className="fa-solid fa-file-pdf fa-2xl file-thumbnail"></i>;
    case constants.DOC:
    case constants.DOCX:
      return <i className="fa-solid fa-file-word fa-2xl file-thumbnail"></i>;
    case constants.XLS:
    case constants.XLSX:
      return <i className="fa-solid fa-file-excel fa-2xl file-thumbnail"></i>;
    case constants.PNG:
    case constants.JPG:
    case constants.JPEG:
      return <Image src={body} thumbnail width="200px" />;
    default:
      return <i className="fa-solid fa-file-file fa-2xl file-thumbnail"></i>;
  }
};

const header = [
  {
    title: "Title",
    prop: "filetitle",
    cell: (row) => (
      <>
          {row.filetitle}  
      </>
    ),
  },
  // {
  //   title: "",
  //   prop: "body",
  //   cell: (row) => (
  //     <>
  //       <center>{renderPreview(row.filetype, row.body)}</center>
  //     </>
  //   ),
  // }, 
  { title: "File Type", prop: "filetype", cell: (row) => row.filetype },
  {
    title: "File Size",
    prop: "filesize",
    cell: (row) => fileSize(row.filesize),
  },
  {
    title: "Created Date",
    prop: "createddate",
    cell: (row) => moment(row.createddate).format("DD-MM-YYYY"),
  },
  {
    title: "Actions",
    prop: "id",
    cell: (row) => (
      <>
        <Button
          class=" fa-paperclip"
          for="files"
          onClick={()=> handleSelectFile(row)}
        > 
          {row.isSelected ?
            <FontAwesomeIcon icon={faMinus} style={{ color: "#ffffff" }} />
            :
            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
          }
        </Button>
      </>
    ),
  },
];

  return (

    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      onHide={() => onHide()}
      size="xl"
      // scrollable
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select Files from Inventories
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <Row>
            <Accordion alwaysOpen defaultActiveKey="0">

            {inventSelectedFiles.length > 0 ?               
              inventSelectedFiles.map((inventory, index) => 
              <Accordion.Item eventKey={index} key={inventory.inventoryname}>
                <Accordion.Header>{inventory.inventoryname}</Accordion.Header>
                <Accordion.Body>
                  {inventory.PdfFiles.length > 0 ?
                            <DatatableWrapper
                                body={inventory.PdfFiles}
                                headers={header}
                            >
                                <Row className="mb-4">
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        className="d-flex flex-col justify-content-start align-items-start"
                                    ></Col>
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        className="d-flex flex-col justify-content-start align-items-start"
                                    ></Col>
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        className="d-flex flex-col justify-content-end align-items-end"
                                    ></Col>
                                </Row>
                                <Table striped className="related-list-table">
                                    <TableHeader />
                                    <TableBody />
                                </Table>
                                {/* <Pagination /> */}
                            </DatatableWrapper>
                  : "No Files Available"
                  }
                </Accordion.Body>
              </Accordion.Item>
                )
              : "No Files in Inventories"}
            </Accordion>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={onHide}>Close</Button>
  
      </Modal.Footer>
    </Modal>
  )
}

export default SelectInventoryFiles