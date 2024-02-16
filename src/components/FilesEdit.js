import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../api/inventoryApi";
import axios from "axios";
import useFileUpload from "react-use-file-upload";
import moment from "moment"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import PubSub from 'pubsub-js';

const FilesEdit = (props) => {
    const [files, setFiles] = useState(props.file.row);
    useEffect(() => {
        if (props.table === "lead" && props.parent !== null && props.file !== null) {
            //.log('//.log(files);', files);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (props.table === "lead") {
            const result = await inventoryApi.saveFiles(files);
            if (result) {
                PubSub.publish('RECORD_SAVED_TOAST', {title: 'Record Saved', message: 'Record saved successfully'});
                submitFiles();
            }
        }
    }
    const submitFiles = () => {
        props.submitFiles();
    };

    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Files
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFile" className="mb-3">
                <Form.Group controlId="formBasicTitle">
                    <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicTitle"
                    >
                        Title
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        value={files.title}
                        onChange={(e) => setFiles({ ...files, [e.target.name]: e.target.value })}
                    />
                    
                </Form.Group>
                </Form.Group>
                <Form.Group controlId="formBasicDescription">
                    <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicDescription"
                    >
                        Description
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Enter description"
                        value={files.description}
                        onChange={(e) => setFiles({ ...files, [e.target.name]: e.target.value })}
                    />
                    
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <div className="submit">
                    <Button variant="success" onClick={handleSubmit}>Submit</Button>
                </div>
                <Button onClick={props.onHide} variant="light">Close</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default FilesEdit;