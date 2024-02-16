import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import inventoryApi from "../api/inventoryApi";
import moment from "moment";
// import jwt_decode from "jwt-decode";
import EmailView from "./common/EmailView";
import { Link } from "react-router-dom";

const RelatedListEmails = (props) => {

  const [file, setFile] = useState({});
  const [modalShowEmailView, setModalShowEmailView] = useState(false);
  // const [userInfo, setUserInfo] = useState({});
  const [body, setBody] = useState([]);
  
  // useEffect(() => {
  //   try {
  //     if(localStorage.getItem('token')){
  //       let user = jwt_decode(localStorage.getItem('token'));
  //       //.log('user:', user);
  //       setUserInfo(user);
  //     }
  //   } catch (error) {
  //     //.log(error)
  //   }
  // }, []);

  useEffect(() => {
    emailsList();
  }, [props.refreshEmailList]);


  const editFile = (row) => {
    // setModalShowFile(true);
    setFile(row);
  };

  const fileView = (row) => {
    //.log("Show this file --> ",row);
    setFile(row);
    setModalShowEmailView(true);
  };

  const emailsList = () => {
    async function init() {
      let emailFiles = await inventoryApi.fetchEmailsLead(props.parent.id);

      //.log("emailFiles inside RelatedListEmails --> ",emailFiles)

      if (emailFiles && emailFiles?.length > 0) {
        setBody(emailFiles)
      } else {
        setBody([]);
      }
    }
    init();
  };

    const header = [
        { title: "Subject", prop: "subject", cell: (row) => (
            <Link onClick={() => fileView(row)} state={row}>
                {row.subject}
            </Link>
        )},
        {
            title: "From",
            prop: "fromaddress",
            cell: (row) => row.fromaddress
        },
        {
            title: "Sent To",
            prop: "toaddress",
            cell: (row) => (
                <>
                    {row.toaddress.split(",").map((email, index) => {
                        if (index === (row.toaddress.split(",").length - 1)) return email
                        return `${email}, `
                    })}
                </>
            )
        },
        // {
        //     title: "CC To",
        //     prop: "ccaddress",
        //     cell: (row) => (
        //         <>  
                    
        //             {row.ccaddress && row.ccaddress.split(",").map((email, index) => {
        //                 if (index === (row.ccaddress.split(",").length - 1)) return email
        //                 return `${email}, `
        //             })}
                
        //         </>
        //     )
        // },
        // { title: "Body", prop: "body", cell: (row) => row.body },
        // {
        //     title: "PDF's Attached",
        //     prop: "pdf",
        //     cell: (row) => (
        //         <>
        //             {/* {Array.isArray(row.pdf) &&
        //                 row.pdf.map((pdf, index) => {

        //                     if (index === row.pdf.length - 1) return pdf.filename
        //                     return `${pdf.filename}, `
        //             })} */}
        //         </>
        //     )
        // },
        {
            title: "Created Date",
            prop: "createddate",
            cell: (row) => moment(row.createddate).format("DD-MM-YYYY"),
        },
    ];

  return (
    <>
      {modalShowEmailView && (
        <EmailView
          file={file}
          show={modalShowEmailView}
          onHide={() => setModalShowEmailView(false)}
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
    </>
  );
};

export default RelatedListEmails;
