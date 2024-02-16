import React, { useState, useEffect,useRef } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import jwt_decode from "jwt-decode";
import inventoryApi from "../../api/inventoryApi";
import FileUpload from './FileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import AttachFile from './AttachFile';




const EmailComposer = (props) => {
const buttonref = useRef();
const [value, setValue] = useState('');
const [files, setFiles] = useState([]);
const [emails, setEmails] = useState([]);
const [selectedFiles, setSelectedFiles] = useState([]);
const [email, setEmail] = useState({to : props.toEmail});
const [user, setUser] = useState();
const [parentid, setParentid] = useState(props.parentid);
const [validated, setValidated] = useState(false);
const [ showAttachFile, setShowAttachFile ] = useState(false)


const modules = {
toolbar: [
['bold', 'italic', 'underline', 'strike'],        // toggled buttons


    // custom button values
[{ 'list': 'ordered'}, { 'list': 'bullet' }],
[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                // text direction

[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

[{ 'align': [] }],
['link'],
['clean']    
],
};

const formats = [
'font','size',
'bold','italic','underline','strike',
'color','background',
'script',
'header','blockquote','code-block',
'indent','list',
'direction','align',
'link','image','video','formula',
];
useEffect(() => {
const fetchData = async () => {
    const emailData = await inventoryApi.fetchEmails();
    //.log('email', emailData.data);
    setEmails(emailData.data)
};
fetchData();
},[]);

useEffect(() => {
let userInfo = jwt_decode(localStorage.getItem('token'));
//.log(userInfo)

let tempValue = {id : userInfo.id, 'username' : userInfo.username, email: userInfo.email};
setUser(tempValue);

setEmail({...email, ['editorHtml'] : `<br/><br/><b>Thanks</b><br/>${userInfo.username}`});

}, []);

const handleChange = (e) => {
//.log(e.target.value)
setEmail({ ...email, [e.target.name]: e.target.value });
};

const handleChangeEditor = (html) => {
setEmail({ ...email, ['editorHtml']: html });

};
const checkRequredFields = () => {

if ((email.subject && email.subject.trim() !== '') && 
    (email.from && email.from.trim() !== '') &&
    (email.to && email.to.trim() !== '') && 
    // (email.cc && email.cc.trim() !== '') &&
    (email.editorHtml && email.editorHtml.trim() !== '')) {
    return false;
}
return true;
}

const handleSubmit = async (e) => {

// email.from = `${user.username}<${user.email}>`;
email.ownerid = user.id;
email.parentid = parentid;
email.attachment = selectedFiles.map(item => item.id);
//const ids = values.map(item => item.id);
//e.preventDefault();
if (checkRequredFields()) {
    setValidated(true);
    return;
}
//.log('ids',email)
email.selectedfile= JSON.stringify({inventoryFilesSent: selectedFiles.map(item => item.id)})

createEmailRecord(email)
const result = await inventoryApi.sendEmailTask(email);
if (result) {
submitTasks();
}

};

const submitTasks = () => {
props.submitTasks();
};

const createEmailRecord = (emailData) => {

    let pdfFiles = []
    let allAttachments = []

    selectedFiles.forEach((file) =>
        file.hasOwnProperty("ispdf") && file.ispdf ?
            pdfFiles.push({ id: file.id, parentid: parentid, filename: file.filetitle })
            : allAttachments.push({ id: file.id, parentid: parentid, filename: file.title })
    )

    async function init(){
        let tempRecord = {
            toaddress: emailData.to,
            fromaddress: emailData.from,
            ccaddress: emailData.cc,
            subject: emailData.subject,
            body: emailData.editorHtml,
            attachments: allAttachments,
            pdf: pdfFiles,
            parentid: props.parentid,
        }
        
        const resultEmailRec = await inventoryApi.createEmailRecord(tempRecord);
        //.log("resultEmailRec --> ",resultEmailRec);
    }
    init()
}

    const handleFile = async (fileset) => {
        //.log('files', fileset);
        var formData = new FormData();
        for (let i = 0; i < fileset.length; i++) {
            //.log("files", fileset[i])
            formData.append(`files${i}`, fileset[i]);
        }
        const result = await inventoryApi.createFile(props.parentid, formData);
        setSelectedFiles((prevFiles) => [...prevFiles, ...result]);
    }

    const handleRemoveFile = async (fileToRemove) => {
        if (await inventoryApi.deleteFile(fileToRemove.id)) {
            const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
            setSelectedFiles(updatedFiles);
        }
    };

return (

    <>
<Modal 
style={showAttachFile ? {filter : "blur(0.075rem)"} : ""}
{...props}
aria-labelledby="contained-modal-title-vcenter"
centered
>
<Modal.Header closeButton>
    <Modal.Title id="contained-modal-title-vcenter">
        Email Composer
    </Modal.Title>
</Modal.Header>
<Modal.Body>
<Container className="view-form">
<Form className="mt-3" onSubmit={handleSubmit} noValidate validated={validated}>
<Form.Group className="mx-3" controlId="formBasicTitle">
                                <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                    Subject
                                </Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="subject"
                                    placeholder="Enter subject"
                                    value={email.subject}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mx-3" controlId="formBasicTitle">
                                <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                    From
                                </Form.Label>
                                <Form.Select
                                    required
                                    // type="text"
                                    name="from"
                                    // placeholder="Comma separated email address"
                                    value={email.from}
                                    onChange={handleChange}
                                >
                                <option value=''>Select</option>
                                {emails && emails.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mx-3" controlId="formBasicTitle">
                                <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                    To
                                </Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="to"
                                    placeholder="Comma separated email address"
                                    value={email.to}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mx-3" controlId="formBasicTitle">
                                <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                    Cc
                                </Form.Label>
                                <Form.Control
                                    // required
                                    type="text"
                                    name="cc"
                                    placeholder="Comma separated email address"
                                    value={email.cc}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mx-3" controlId="formBasicTitle">
                                <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                                    Body
                                </Form.Label>
                                <ReactQuill
                                 onChange={handleChangeEditor} 
                                 required
                                 value={email.editorHtml}
                                 theme="snow" 
                                  modules={modules}
                                formats={formats}/>
                            </Form.Group>

        {/* <FileUpload  handleFile={(files) => handleFile(files)} parentid={parentid}/> */}
        <Button
        class=" fa-paperclip"
        for="files"
        style={{ margin: "14px" }}
        onClick={() =>{
            setShowAttachFile(!showAttachFile) 
            setSelectedFiles([])
            // buttonref.current.click()
        }}
        >
     <FontAwesomeIcon icon={faPaperclip}   style={{color: "#ffffff"}}/> &nbsp;
        Attach
        </Button>
        {/* <input
            style={{ visibility: "hidden" }}
            ref={buttonref}
        type="file"
        multiple
        onChange={(e) => {handleFile(e.target.files)}} /> */}
            <br/>
            <div>
<h6>Selected Files:</h6>
<ul>
{ selectedFiles.length > 0 ? selectedFiles.map((file, index) => (
    <li key={index}>
        {file.title ? file.title : file.filetitle}
        <Button
        variant='Light'
        style={{ border: 'hidden', backgroundColor: 'white'}}
        onClick={() => handleRemoveFile(file)}
        >X</Button>
    </li>
    )) : ''}
</ul>
</div>
</Form>
            </Container>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={()=> handleSubmit(selectedFiles)}>Save</Button>
            <Button onClick={()=>{
        setSelectedFiles([]);
            props.onHide()
            }} 
            variant="light">Close</Button>
        </Modal.Footer>
{
        showAttachFile && (
            <AttachFile
                parentid={props.parentid}
                show={showAttachFile}
                onHide={() => setShowAttachFile(!showAttachFile)}
                finalFiles={(data) => {

                    setSelectedFiles(
                        data.map((file) => {
                            return file.hasOwnProperty("id") ? file : {...file, title: file.filetitle, id: file.fileid}
                        })
                    )
                    // handleFile(data)
                    setShowAttachFile(!showAttachFile)
                }}
            />
        )
    }
    </Modal>

</>
    )}
export default EmailComposer;