import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Form, Modal, Col, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faPaperclip, faLaptop } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import * as constants from "../../constants/CONSTANT"
import Image from "react-bootstrap/Image";
import {
    DatatableWrapper,
    Pagination,
    TableBody,
    TableHeader,
  } from "react-bs-datatable";
import inventoryApi from '../../api/inventoryApi';
import jwt_decode from "jwt-decode"
import FileUpload from '../FileUpload';
import { v4 as uuidv4 } from 'uuid';
import SelectInventoryFiles from './SelectInventoryFiles';

const AttachFile = ({ parentid, show, onHide, finalFiles }) => {

    const buttonref = useRef();
    const [body, setBody] = useState([]);
    const [showInventoryFiles, setShowInventoryFiles] = useState(false)
    const [modalShow, setModalShow] = useState(false)
    const [allSelectedFiles, setAllSelectedFiles] = useState([]);
    const [selectedDeviceFiles, setSelectedDeviceFiles] = useState([]);
    const [selectedInventoryFiles, setSelectedInventoryFiles] = useState([])

    useEffect(() => {
        filesList();
    }, [])
    
    const filesList = () => {
        async function init() {
          let files = await inventoryApi.fetchLeadEmailFiles();
          let user = jwt_decode(localStorage.getItem('token'));
          //////.log(files)
          if (files && files?.length > 0) {
            let arr = [];
            for (let i = 0; i < files.length; i++) {
              let file = files[i];
              if (
                file.filetype === "jpg" ||
                file.filetype === "jpeg" ||
                file.filetype === "png"
              ) {
                ////.log('fetch:', file.filetype);
                // let result = await inventoryApi.downloadFiles(file);
                // ////.log('result:', result);
                // file['body'] = window.URL.createObjectURL(result);
    
                if (
                    // props?.table && 
                    file?.documenttype && file.documenttype !== 'other') {
                  //const result = await inventoryApi.download3DFiles(file.id);
                  file["body"] = `${constants.PROJECT_BASE_URL}/images/${user.tenantcode}/${parentid}/${file.id}.${file.filetype}`
                } else {
                  ////.log('dfssdfsdf')
                  const result = await inventoryApi.downloadFiles(file);
                  file["body"] = window.URL.createObjectURL(result);
                }
              } else {
                file["body"] = "";
              }
              arr.push(file);
            }

            // //.log("normal arr --> ",arr);
            // //.log("spread arr --> ",[...arr]);

            setBody(arr.map((data) => {return {...data, isSelected: false}}))


            //let pArray = [];
            // setDownloads([...downloads, ...pArray]);
            //////.log('downloads:', pArray);
          } else {
            setBody([]);
          }
        }
        init();
      };

    const handleRemoveFile = async (fileToRemove) => {

      if(fileToRemove.hasOwnProperty("id")){
        setSelectedDeviceFiles((prev) => prev.filter((each) => each.id !== fileToRemove.id))
      }else{
        setSelectedInventoryFiles((prev) => prev.filter((file) => file.fileid !== fileToRemove.fileid))
      }
    };

    const handleFile = async (fileset) => {

      var formData = new FormData();
      for (let i = 0; i < fileset.length; i++) {
          //.log("files", fileset[i])
          formData.append(`files${i}`, fileset[i]);
      }
      const result = await inventoryApi.createFile(parentid, formData);
      
      setSelectedDeviceFiles((prev) => [...prev, ...result])
    }


    return (

        <>

        <Modal
          style={modalShow ? { filter: "blur(0.1rem)" } : ""}
          show={show}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onHide()}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Attach Files
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Form className="mt-3" noValidate 
                    // validated={validated}
                    >

                        <Button
                            class=" fa-paperclip"
                            for="files"
                            style={{ margin: "14px" }}
                            onClick={() => {
                                buttonref.current.click()
                            }}
                        >
                            <FontAwesomeIcon icon={faLaptop} style={{ color: "#ffffff" }} /> &nbsp;
                            Upload from Device
                        </Button>

                        <Button
                            class=" fa-paperclip"
                            for="files"
                            style={{ margin: "14px" }}
                            onClick={() => {
                              setSelectedInventoryFiles([])
                              setModalShow(!modalShow)
                            }}
                        >
                            <FontAwesomeIcon icon={faFileArrowUp} style={{ color: "#ffffff" }} /> &nbsp;
                            Upload from Inventory files
                        </Button>

                        <input
                            style={{ visibility: "hidden" }}
                            ref={buttonref}
                            type="file"
                            multiple
                            onChange={(e) => { handleFile(e.target.files) }}
                        />

                        <br />
                        <br />
                        <br />

                        <div>
                            <h6>Selected Files:</h6>
                            <ul>

                                {[...selectedDeviceFiles, ...selectedInventoryFiles].length > 0 ? [...selectedDeviceFiles, ...selectedInventoryFiles].map((file, index) => (
                                    <li key={index}>
                                        {file.title ? file.title : file.filetitle}
                                        <Button
                                            variant='Light'
                                            style={{ border: 'hidden', backgroundColor: 'white' }}
                                            onClick={() => handleRemoveFile(file)}
                                        >X</Button>
                                    </li>
                                )) : ""}

                            </ul>
                        </div>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => 
                  finalFiles([...selectedDeviceFiles, ...selectedInventoryFiles])
                  }>Next</Button>
                <Button onClick={() => {
                    onHide()
                }}
                    variant="light">Close</Button>
            </Modal.Footer>

          {
            modalShow && (
              <SelectInventoryFiles
                parentid={parentid}
                show={modalShow}
                // prevSelectedFiles={selectedInventoryFiles}
                onHide={() => setModalShow(!modalShow)}
                confirmFiles={(data) => {

                  //.log("selected files inside AttachFile --> ", data);
                  setModalShow(!modalShow)
                  setSelectedInventoryFiles(data)
                }}
              />
            )
          }

        </Modal>

        </>
    )   
}

export default AttachFile