import React, { useState, useEffect } from "react";
import { Button, Col, Row, Table,Tooltip,OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import Badge from 'react-bootstrap/Badge';
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import inventoryApi from "../api/inventoryApi";
import moment from "moment";
import Confirm from "./common/Confirm";
import FilesEdit from "./FilesEdit";
import FilesView from "./FilesView";
import fileDownload from "js-file-download";
import Image from "react-bootstrap/Image";
import * as constants from "../constants/CONSTANT";
import jwt_decode from "jwt-decode";
import fileDownload1 from 'js-file-download';

const RelatedListFiles = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [file, setFile] = React.useState("");
  const [downloads, setDownloads] = React.useState([]);
  const [modalShowFile, setModalShowFile] = React.useState(false);
  const [modalShowFileView, setModalShowFileView] = React.useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [body, setBody] = useState([]);
  const [tooltipDeleteVisibility, setTooltipDeleteVisibility] = useState({});
  const [tooltipEditVisibility, setTooltipEditVisibility] = useState({});
  const MIMEType = new Map([
    ["text/csv", "csv"],
    ["application/msword", "doc"],
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "docx",
    ],
    ["image/gif", "gif"],
    ["text/html", "html"],
    ["image/jpeg", "jpeg"],
    ["image/jpg", "jpg"],
    ["application/json", "json"],
    ["audio/mpeg", "mp3"],
    ["video/mp4", "mp4"],
    ["image/png", "png"],
    ["application/pdf", "pdf"],
    ["application/vnd.ms-powerpoint", "ppt"],
    [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "pptx",
    ],
    ["image/svg+xml", "svg"],
    ["text/plain", "txt"],
    ["application/vnd.ms-excel", "xls"],
    [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "xlsx",
    ],
    ["text/xm", "xml"],
    ["application/xml", "xml"],
    ["application/atom+xml", "xml"],
    ["application/zip", "zip"],
  ]);
  
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
    filesList();
  }, [props.refreshFileList]);

  const handleDelete = (row) => {
    setModalShow(true);
    setFile(row);
  };

  const labels = {
    beforeSelect: " ",
  };
  const deleteFile = async () => {
    ////.log("delete call", file.id);
    const result = await inventoryApi.deleteFile(file.id);
    ////.log("delete successfully ", result);
    if (result.success) {
      const filterFiles = body.filter((item) => item.id !== file.id);
      setBody(filterFiles);
      setModalShow(false);
      if(props?.table && props.table === 'project'){
        if(file.documenttype === 'project_3d_plan'){
          let project = {id:props.parent.id , file3d:''}
          let updateProject = await inventoryApi.saveProject(project);
        }
        props.handleRefreshList();
      }
      
    }
  };

  const downloadFile = async (row) => {
    ////.log('if file download call',row)
    // const result = await inventoryApi.downloadFiles(row);
    // if (result) {
    //   fileDownload(result, row.title);
    // }

    if (props?.table && row?.documenttype && row.documenttype !== 'other') {
        // //.log(`${constants.PROJECT_BASE_URL}/images/${userInfo.tenantcode}/${props.parent.id}/${row.id}.${row.filetype}`)
        const imageUrl = `${constants.PROJECT_BASE_URL}/images/${userInfo.tenantcode}/${props.parent.id}/${row.id}.${row.filetype}`; // Replace with the actual URL of the image
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
        fileDownload(result, row.title);
      }
    }

    /* if (result.success) {
        ////.log('download success')
        setFile('');
        //setModalShow(false);
        //filesList();
    }*/
  };

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

  const submitFiles = () => {
    setModalShowFile(false);
    filesList();
  };

  const editFile = (row) => {
    setModalShowFile(true);
    setFile(row);
  };

  const fileView = (row) => {
    setModalShowFileView(true);
    setFile(row);
  };

  const filesList = () => {
    async function init() {
      let files = await inventoryApi.fetchFiles(props.parent.id);

      let user = jwt_decode(localStorage.getItem('token'));
      //.log(files)
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

            // if (props?.table && file?.documenttype && file.documenttype !== 'other') {
            //   //const result = await inventoryApi.download3DFiles(file.id);
            //   file["body"] = `${constants.PROJECT_BASE_URL}/images/${user.tenantcode}/${props.parent.id}/${file.id}.${file.filetype}`
            // } else {
              ////.log('dfssdfsdf')
              const result = await inventoryApi.downloadFiles(file);
              file["body"] = window.URL.createObjectURL(result);
            // }
          } else {
            file["body"] = "";
          }
          arr.push(file);
        }
        setBody([...arr]);
        //let pArray = [];
        // setDownloads([...downloads, ...pArray]);
        //////.log('downloads:', pArray);
      } else {
        setBody([]);
      }
    }
    init();
  };

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
      prop: "title",
      cell: (row) => (
        <>
        
          <Link onClick={() => fileView({ row })} state={props.parent}>
            {row.title}  
            
          </Link>
          
        <br/>
        <Badge bg="secondary">{row?.documenttype?.replaceAll("_" , " ").toUpperCase() }</Badge>
        </>
      ),
    },
    {
      title: "",
      prop: "body",
      cell: (row) => (
        <>
          <center>{renderPreview(row.filetype, row.body)}</center>
        </>
      ),
    },
    
    
   
    
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
               title="Edit"
              className="btn-sm mx-2"
              onClick={() => editFile({ row })}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>

            <Button
              title="Delete"
              className="btn-sm mx-2"
              variant="danger"
              onClick={() => handleDelete(row)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </Button>
            <Button
              title="Download"
              className="btn-sm mx-2"
              variant="danger"
              onClick={() => downloadFile(row)}
            >
              <i className="fa fa-cloud-download"></i>
            </Button>
           
        </>
      ),
    },
  ];

  return (
    <>
      {modalShow && (
        <Confirm
          show={modalShow}
          onHide={() => setModalShow(false)}
          deleteFile={deleteFile}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="file"
        />
      )}
      {modalShowFile && (
        <FilesEdit
          show={modalShowFile}
          onHide={() => setModalShowFile(false)}
          parent={props.parent}
          file={file}
          table="lead"
          submitFiles={submitFiles}
        />
      )}
      {modalShowFileView && (
        <FilesView
          show={modalShowFileView}
          onHide={() => setModalShowFileView(false)}
          file={file}
        />
      )}
      {body ? (
        <DatatableWrapper
          body={body}
          headers={header}
          paginationOptionsProps={{
            initialState: {
              rowsPerPage: 5,
            },
          }}
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
          <Pagination />
        </DatatableWrapper>
      ) : (
        ""
      )}
      <p style={{ color: "red" }}>
        {downloads?.length > 0
          ? downloads.map((row, index) => <img src={row} />)
          : ""}
      </p>
    </>
  );
};

export default RelatedListFiles;
