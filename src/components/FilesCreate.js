import React, { useState, useEffect } from "react";
import {  ProgressBar } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap-typeahead/css/Typeahead.css";
import inventoryApi from "../api/inventoryApi";
import FormData from "form-data";
import axios from "axios";
import PubSub from "pubsub-js";
import * as constants from "../constants/CONSTANT";
import {SectionInTemplateOptions} from '../constants/DefalutPdfValues'
const FilesCreate = (props) => {
  const [sectionInTemplateValues, setSectionInTemplateValues] = useState(SectionInTemplateOptions);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fileDescription, setFileDescription] = useState("");
  const [sectionintemplate, SetSectionintemplate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSectionInTemplateField, setShowSectionInTemplateField] = useState(false)
  const [error, setError] = useState(false);
  const imageType = [["png"], ["gif"], ["jpg"], ["jpeg"]];
  const fileType = [
    ["csv"],
    ["doc"],
    ["docx"],
    ["mp4"],
    ["pdf"],
    ["ppt"],
    ["pptx"],
    ["svg"],
    ["txt"],
    ["xls"],
    ["xlsx"],
  ];
  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchFiles(props.parent.id);
      if(result?.length > 0){

        const documentTypes = result.map(item => item.sectionintemplate);
        const updatedValues = sectionInTemplateValues.filter(item => !documentTypes.includes(item.value));
        setSectionInTemplateValues(updatedValues);
      }
      
    }
    init();
  }, []);

  const handleSubmit = async (event) => {

    event.preventDefault();
    var formData = new FormData();
    
    if ((props.table === "property" || props.table === "project") && props.file !== 'pdf') {
      if (selectedImage && selectedFileType) {
        const token = localStorage.getItem("token");
    
        if (selectedImage) {
          formData.append("image", selectedImage);
          formData.append(`description`, fileDescription);
          formData.append(`fileType`, selectedFileType);
          formData.append(`sectionintemplate`, sectionintemplate);
        }

        axios
          .post(
            `${constants.API_BASE_URL}/api/files/${props.parent.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
              onUploadProgress: (data) => {
                setProgress(Math.round((100 * data.loaded) / data.total));
              },
            }
          )
          .then((response) => {
            PubSub.publish("RECORD_SAVED_TOAST", {
              title: "Record Saved",
              message: "Record saved successfully",
            });
            submitfiles();
          })
          .catch((error) => {
            //.log(error);
          });
      } else {
        setErrorMessage('Please select document type and file');
      }
    }
    else if ((props.table === "contact" || props.table === "sitevisit") && props.file !== 'pdf') {
      if (selectedImage) {
        const token = localStorage.getItem("token");    
        if (selectedImage) {
          formData.append(`fileType`, selectedFileType);
          formData.append("image", selectedImage);
          formData.append(`description`, fileDescription);
        }

        axios
          .post(
            `${constants.API_BASE_URL}/api/files/${props.parent.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
              onUploadProgress: (data) => {
                setProgress(Math.round((100 * data.loaded) / data.total));
              },
            }
          )
          .then((response) => {
            PubSub.publish("RECORD_SAVED_TOAST", {
              title: "Record Saved",
              message: "Record saved successfully",
            });
            submitfiles();
          })
          .catch((error) => {
          });
      } else {
        setErrorMessage('Please select document type and file');
      }
    }
    else{
      if (selectedImage) {
        const token = localStorage.getItem("token");
        if (selectedImage) {
          
          formData.append("image", selectedImage);
          formData.append(`description`,fileDescription);
          formData.append(`fileType`, selectedImage);
          formData.append(`ispdf`, true);
        }
        axios
        .post(
          `${constants.API_BASE_URL}/api/files/${props.parent.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
            onUploadProgress: (data) => {
              setProgress(Math.round((100 * data.loaded) / data.total));
            },
          }
        )
          .then((response) => {
            PubSub.publish("RECORD_SAVED_TOAST", {
              title: "Record Saved",
              message: "Record saved successfully",
            });
            submitpdf();
          })
          .catch((error) => {
            //.log(error);
          });
      } else {
        setError(false);
        setErrorMessage('Please select file');
      }
    }
    
  };

  const submitfiles = () => {
    props.submitfiles();
  };
  const submitpdf = () => {
    props.submitfiles();
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Files
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {progress > 0 && (
          <ProgressBar now={progress} label={`${progress}%`} srOnly />
        )}
        {((props.table === "property")&& (props.file !=='pdf')) && (
          <Form.Group controlId="formBasicFileType" className="mt-3">
            <Form.Label>Document Type</Form.Label>
            <Form.Select
            name="documenttype"
               onChange={(e) =>{ 
                if(e.target.value === 'template_images'){
                  setSelectedFileType(e.target.value)
                  setShowSectionInTemplateField(true)
                }else{
                  setShowSectionInTemplateField(false)
                  setSelectedFileType(e.target.value)
                  setFiles({ ...files, [e.target.name]: e.target.value })}}
                 
                }
            >
              <option value="">Select Type</option>
              {props.table === "property" && (
                <>
                  <option value="property_image">Property Image</option>
                  <option value="template_images">Template Images</option>
                </>
              )}
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
        )}
        {((props.table !== "property" && props.table === "sitevisit")&& (props.file !=='pdf')) && (
          <Form.Group controlId="formBasicFileType" className="mt-3">
            <Form.Label>Document Type</Form.Label>
            <Form.Select
            name="documenttype"
               onChange={(e) =>{ 
                if(e.target.value === 'template_images'){
                  setSelectedFileType(e.target.value)
                  setShowSectionInTemplateField(true)
                }else{
                  setShowSectionInTemplateField(false)
                  setSelectedFileType(e.target.value)
                  setFiles({ ...files, [e.target.name]: e.target.value })}}
                 
                }
            >
                  <option value="">Select Type</option>
                  <option value="Front Photo">Front Photo</option>
                  <option value="Left Photo">Left Photo</option>
                  <option value="Right Photo">Right Photo</option>
                  <option value="Center Photo">Center Photo</option>
                  <option value="Back Photo">Back Photo</option>
                  <option value="other"> Any Other Photo</option>
            </Form.Select>
          </Form.Group>
        )}
        {(props.table === "property") && showSectionInTemplateField && (
          <Form.Group controlId="formBasicFileType" className="mt-3">
            <Form.Label>Section in template</Form.Label>
            <Form.Select 
            onChange={(e)=>{
              SetSectionintemplate(e.target.value)
            }} >
              {props.table === "property" && (
                <>
                <option value='' >
                      Select
                    </option>
                {sectionInTemplateValues.map(item => (
                    <option value={item.value} >
                      {item.label}
                    </option>
                  ))}
                </>
              )}
            </Form.Select>
          </Form.Group>
        )}

        <Form.Group controlId="formBasicImage" className="mt-2"> * File size should not exceed 30 MB. <br/><br/>
          <Form.Label> {props.file ==='pdf' ? 'Select Pdf' : 'Select Image'}</Form.Label>
         {props.file ==='pdf' ? (<Form.Control
            type="file"
            accept=".pdf"
            onChange={ (event) => {
              const fileInput = event.target;
              const MAX_SINGLE_FILE_SIZE = 30;
              if (fileInput.files.length > 0) {
                const fileSizeMB = fileInput.files[0].size / (1024 * 1024);
                const fileSizeValid = fileSizeMB <= MAX_SINGLE_FILE_SIZE;
                if (fileSizeValid === true)  {
                  setErrorMessage("");
                  setError(false);
                  setSelectedImage(selectedImage);
                  const fileName = fileInput.files[0].name;
                  const fileExtension = fileName.split('.').pop().toLowerCase();
                  if (fileExtension !== 'pdf') {
                    setError(true);
                    setErrorMessage('Please select a valid PDF file.');
                    fileInput.value = '';
                  } else {
                    setSelectedImage(fileInput.files[0]);
                    setError(false);
                    setErrorMessage('');
                  }
                } else {
                  setErrorMessage(
                    `File size should not exceed ${MAX_SINGLE_FILE_SIZE} MB.`
                  );
                  setError(true);
                }
               
              }}}
          />) :(<Form.Control
            type="file"
            accept="image/*,video/*"
            onChange={ (event) => {
              const fileInput = event.target;
              const MAX_SINGLE_FILE_SIZE = 30;
              if (fileInput.files.length > 0) {
                const fileSizeMB = fileInput.files[0].size / (1024 * 1024);
                const fileSizeValid = fileSizeMB <= MAX_SINGLE_FILE_SIZE;
                if (fileSizeValid === true)  {
                  setErrorMessage("");
                  setError(false);
                  setSelectedImage(selectedImage);
                  const fileName = fileInput.files[0].name;
                  const fileExtension = imageType.some((types) =>
                  types.includes(fileName.split(".").pop().toLowerCase())
                  )
                  console.log('fileName',fileName.split(".").pop().toLowerCase());
                  if (fileExtension == false && selectedFileType !== 'other') {
                    setError(true);
                    setErrorMessage('Please select a  Image file.');
                    fileInput.value = '';
                  } else if(fileExtension == false && fileName.split(".").pop().toLowerCase() === 'mp4' && selectedFileType === 'other' ){
                    setSelectedImage(fileInput.files[0]);
                    setError(false);
                    setErrorMessage('');
                  }
                  else {
                    setSelectedImage(fileInput.files[0]);
                    setError(false);
                    setErrorMessage('');
                  }
                } else {
                  setErrorMessage(
                    `File size should not exceed ${MAX_SINGLE_FILE_SIZE} MB.`
                  );
                  setError(true);
                }
               
              }}}
          />)}
        </Form.Group>

        <Form.Group controlId="formBasicDescription" className="mt-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Enter description"
            onChange={(e) => setFileDescription(e.target.value)}
          />
        </Form.Group>
        {errorMessage && (
          <div className="text-danger">
            <b>{errorMessage}</b>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="submit">
          <Button variant="success" onClick={handleSubmit} disabled={error}>
            Submit
          </Button>
        </div>
        <Button onClick={props.onHide} variant="light">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
};


export default FilesCreate;