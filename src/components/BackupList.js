import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import { useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import fileDownload from "js-file-download";
import moment from "moment";
import PubSub from "pubsub-js";
import NewInfoPill from "./common/NewInfoPill/NewInfoPill";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Link } from "react-router-dom";
import Confirm from "./common/Confirm";
import inventoryApi from "../api/inventoryApi";

const BackupList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [leadname, setLeadName] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  // const[contact,setContact] = useState(location.state ? location.state : {});
  const [lead, setLead] = useState();
  const [downloading, setDownloading] = useState(false);
  const [file, setFile] = React.useState("");
  //////.log('location.state ='+location.state)
  const [leadStatusArray, setleadStatusArray] = useState(
    JSON.parse(localStorage.getItem("lead_status"))
  );

  useEffect(() => {
    async function init() {
      const backups = await inventoryApi.fetchBackups();

      //.log("backups", backups);
      if (backups) {
        ////.log("lead data =>", leads);
        setBody(backups);
        setLead(backups);
      } else {
        setBody([]);
        setLead([]);
      }
    }
    init();
  }, []);

  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(lead);
    } else {
      setBody(
        lead.filter((data) => {
          if (
            (data.leadstatus || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
        })
      );
    }
  };

  const handleDelete = (row) => {
    setModalShow(true);
    setFile(row);
  };

  const getStatusClass = (status) => {
    ////.log('status',status)
    let accessStatusRec = leadStatusArray.filter((value, index, array) => {
      if (value.label === status) {
        return true;
      }
    });
    ////.log('accessStatusRec',accessStatusRec)
    if (accessStatusRec && accessStatusRec.length > 0) {
      if (accessStatusRec[0].is_converted === true) {
        ////.log('if isconverted')

        return "success";
      } else if (accessStatusRec[0].is_lost === true) {
        return "secondary";
      } else {
        return "primary";
      }
    } else {
      return "secondary";
    }
  };

  const downloadFile = async (row) => {
    //.log("if file download call", row);
    setDownloading(true);

    const result = await inventoryApi.downloadBackupFile(row.name);
    if (result) {
      fileDownload(result, row.name);
      setDownloading(false);
    }

    /* if (result.success) {
      //////.log('download success')
      setFile('');
      //setModalShow(false);
      //filesList();
  }*/
  };

  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "File Name",
      prop: "name",
      isFilterable: true,
      isSortable: true,
    },
    {
      title: "File Created",
      prop: "ctime",
      isFilterable: true,
      cell: (row) => (
        <>{moment(row.fileStats.ctime).format("YYYY-MM-DD hh:mm a")}</>
      ),
    },
    {
      title: "File Size",
      prop: "size",
      isFilterable: true,
      cell: (row) => (
        <>{parseFloat(row.fileStats.size / 1000000).toFixed(2) + " MB"}</>
      ),
    },
    {
      title: "Actions",
      prop: "id",
      cell: (row) => (
        <>
          <Button
            className="btn-sm mx-2"
            variant="danger"
            onClick={() => downloadFile(row)}
          >
            <i class="fa-solid fa-download"></i>
          </Button>
          <Button
            className="btn-sm mx-2"
            variant="danger"
            onClick={() => handleDelete(row)}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Button>
        </>
      ),
    },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const handleSubmit = async (e) => {
    setDownloading(true);
    let result = await inventoryApi.createBackup();

    //.log("result ===>", result);
    if (result.success) {
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Backup Created",
        message: "Backup created successfully",
      });
      setTimeout(() => {
        init();
      }, 1500);
    } else {
      PubSub.publish("RECORD_ERROR_TOAST", {
        title: "Backup Error",
        message: "Some error occured",
      });
      setDownloading(false);
    }

    async function init() {
      const backups = await inventoryApi.fetchBackups();
      setDownloading(false);
      //.log("backups", backups);
      if (backups) {
        ////.log("lead data =>", leads);
        setBody(backups);
        setLead(backups);
      } else {
        setBody([]);
        setLead([]);
      }
    }
  };

  const deleteFile = async () => {
    ////.log('delete call', file.id)
    const result = await inventoryApi.deleteBackupFile(file.name);
    //.log("delete successfully ", result);
    setModalShow(false);
    if (result.success) {
      const newArray = body.filter((object) => {
        return object.name !== file.name;
      });

      setBody(newArray);
    }
  };

  return (
    <Row className="g-0">
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

      <Col lg={12} className="px-4 mt-4">
        <Alert variant="warning">
          Backup files are stored on server upto 7 days. Please download before
          delete.
        </Alert>
        <DatatableWrapper
          body={body}
          headers={header}
          paginationOptionsProps={{
            initialState: {
              rowsPerPage: 15,
              options: [5, 10, 15, 20],
            },
          }}
        >
          <Row className="mb-4 row align-items-end justify-content-between">
            <Col
              xs={12}
              lg={4}
              className=""
            >
              <Filter />
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={1}
              className="d-flex flex-col "
            >
              <PaginationOptions labels={labels} />
            </Col>
            <Col xs={12} sm={6} lg={2}>
              <NewInfoPill left="Total" right={body?.length} />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              {/* <InfoPill left="Total" right={body?.length} />  */}
              {downloading && (
                <button class="btn btn-warning mt-4" type="button" disabled>
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </button>
              )}
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={2}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <Button
                className="btn-sm" 
                variant="outline-primary mx-2"
                onClick={() => handleSubmit(true)}
              >
                New Backup
              </Button>
              {/* <Button className="btn-sm" variant="outline-primary" onClick={()=>location.state ? navigate(`/contacts/${contact.id}`) : navigate('/contacts/')}>Back to Contact</Button> */}
            </Col>
          </Row>
          {body ? (
            <Table striped className="data-table" responsive="sm">
              <TableHeader />

              <TableBody />
            </Table>
          ) : (
            <ShimmerTable row={10} col={8} />
          )}

          <Pagination />
        </DatatableWrapper>
      </Col>
      <Col lg={2}></Col>
    </Row>
  );
};
export default BackupList;
