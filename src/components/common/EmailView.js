import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import inventoryApi from '../../api/inventoryApi';
import { Link } from 'react-router-dom';
import fileDownload from "js-file-download";
import jwt_decode from "jwt-decode";
import * as constants from "../../constants/CONSTANT"

const EmailView = ({ show, onHide, refreshFileList, file }) => {

    const [userInfo, setUserInfo] = useState({});
    const [email, setEmail] = useState({});
    const [toAddress, setToAddress] = useState("")
    const [ccAddress, setCCAddress] = useState("")
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        try {
          if(localStorage.getItem('token')){
            let user = jwt_decode(localStorage.getItem('token'));
            //.log('user:', user);
            setUserInfo(user);
          }
        } catch (error) {
          //.log(error)
        }
      }, []);

    useEffect(() => {

        //.log("current email file --> ",file);

        if (file.toaddress) setToAddress(getFormattedData(file.toaddress))
        if (file.ccaddress) setCCAddress(getFormattedData(file.ccaddress))

        let tempArr = []
        if (file.pdf.length > 0) file.pdf.forEach((file) => tempArr.push(file))
        if (file.attachments.length > 0) file.attachments.forEach((file) => tempArr.push(file))
        
        setSelectedFiles(tempArr)        

        setEmail(file)
    }, [refreshFileList]);


    const emailsList = () => {
        async function init() {
            let emailFile = await inventoryApi.fetchEmailsLead(file.id);

            //.log("emailFile inside EmailView --> ", emailFile)

            if (Object.keys(emailFile).length > 0) setEmail(emailFile)
            else setEmail({});
        }
        init();
    };

    const getFormattedData = (dataString) => {

        let finalString = ""

        if (dataString.includes(",")) {
            dataString.split(",").map((file, index) => {
                if (index === (dataString.split(",").length - 1)) {
                    finalString += file
                }
                else finalString += `${file}, `
            })
            return finalString
        }
        else return dataString
    }

    const handleDownloadFile = async (row) => {

        //.log("inside download file --> ",row);

        if (row?.documenttype && row.documenttype !== 'other') {
            // //.log(`${constants.PROJECT_BASE_URL}/images/${userInfo.tenantcode}/${props.parent.id}/${row.id}.${row.filetype}`)
            const imageUrl = `${constants.PROJECT_BASE_URL}/images/${userInfo.tenantcode}/${row.parentid}/${row.id}.${row.filetype}`; // Replace with the actual URL of the image
            // const link = document.createElement('a');
            // link.href = imageUrl;
            // link.target = "_blank";
            // link.download = row.title; // Set the desired file name
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // fileDownload(imageUrl, row.title);
            downloadImage(imageUrl, row.title);
        } else {
          const result = await inventoryApi.downloadFiles(row);
        
          if (result) {
            fileDownload(result, row.filename);
          }
        }
    }

    const downloadImage = async (
        imageSrc,
        nameOfDownload
      ) => {
        const response = await fetch(imageSrc);
      
        const blobImage = await response.blob();
      
        const href = URL.createObjectURL(blobImage);
      
        const anchorElement = document.createElement('a');
        anchorElement.href = href;
        anchorElement.download = nameOfDownload;
      
        document.body.appendChild(anchorElement);
        anchorElement.click();
      
        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
      }

    return (
        <Modal
            show={show}
            onHide={() => onHide()}
            aria-labelledby="contained-modal-title-vcenter"
            size="lg"
            centered
        >
            <Modal.Body>
                <Container className="view-form">
                    <Form className="mt-3" noValidate>
                        <Form.Group className="mx-3" controlId="formBasicTitle">
                            <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                Subject
                            </Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                name="subject"
                                placeholder="No subject"
                                value={email?.subject}
                            />
                        </Form.Group>
                        <Form.Group className="mx-3" controlId="formBasicTitle">
                            <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                From
                            </Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                name="from"
                                placeholder="No FROM email address"
                                value={email?.fromaddress}
                            />
                        </Form.Group>
                        <Form.Group className="mx-3" controlId="formBasicTitle">
                            <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                To
                            </Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                name="to"
                                placeholder="No TO email address"
                                value={toAddress}
                            />
                        </Form.Group>
                        <Form.Group className="mx-3" controlId="formBasicTitle">
                            <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                Cc
                            </Form.Label>
                            <Form.Control
                                disabled
                                type="text"
                                name="cc"
                                placeholder="No CC email addresses"
                                value={ccAddress}
                            />
                        </Form.Group>

                        <Form.Group className="mx-3" controlId="formBasicTitle">
                            <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                Body
                            </Form.Label>
                            <ReactQuill
                                placeholder="No body"
                                readOnly
                                modules={{toolbar: false}}
                                value={email?.body}
                                theme="snow"
                            />
                        </Form.Group>
                        <br />
                        <div>
                            <h6>Attached Files:</h6>
                            <ul>
                                {selectedFiles.length > 0 ? selectedFiles.map((file, index) => (
                                    <li key={index}>
                                        <Link onClick={() => handleDownloadFile(file)}>
                                        {file.filename}
                                        </Link>
                                    </li>
                                )) : <li>No files Attached</li>}
                            </ul>
                        </div>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => onHide()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EmailView