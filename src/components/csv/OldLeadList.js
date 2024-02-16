import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import Form from "react-bootstrap/Form";
import { ShimmerTable } from "react-shimmer-effects";
import Badge from "react-bootstrap/Badge";
import CSVSelector from "./CSVSelector";
import moment from "moment";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Link } from "react-router-dom";
// import InfoPill from "./InfoPill";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";

const OldLeadList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadname, setLeadName] = useState();
  const [lead, setLead] = useState();
  const [leadStatusArray, setleadStatusArray] = useState(
    JSON.parse(localStorage.getItem("lead_status"))
  );
  const [csvModalShow, setCSVModalShow] = useState();
  const [fetchData, setFetchData] = useState(false);

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchOldLeads();

      //.log("leads--->", leads);
      if (result) {
        setBody(result);
        setLeads(result);
      } else {
        setLeads([]);
      }
    }
    init();
  }, [fetchData]);

  // ====== Filter on status =======
  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(leads);
    } else {
      setBody(
        leads.filter((data) => {
          if (
            (data.status || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
        })
      );
    }
  };

  // const getStatusClass = (status) =>{
  //   //.log('status',status)
  //   let accessStatusRec = leadStatusArray.filter((value, index, array) => {
  //     if(value.label === status){

  //      return true
  //     }

  //   });
  //   //.log('accessStatusRec',accessStatusRec)
  //   if(accessStatusRec && accessStatusRec.length > 0){

  //   if(accessStatusRec[0].sortorder === 3){
  //     ////.log('if isconverted')

  //     return 'success';
  //   }else if (accessStatusRec[0].sortorder === 4){
  //     // return 'secondary';
  //     return 'danger';
  //   }else if(accessStatusRec[0].sortorder === 1){
  //     return 'info';
  //   }
  //   else if(accessStatusRec[0].sortorder === 2){
  //     return 'warning';
  //   }
  // }else{
  //   return 'secondary';
  // }
  // }

  const getStatusClass = (status) => {
    // //.log("getstatus", status);

    if (status) {
      if (status === "Open - Not Contacted") {
        //.log("status open", status);
        return "primary";
      } else if (status === "Working - Contacted") {
        return "warning";
      } else if (status === "Closed - Converted") {
        return "success";
      } else if (status === "Closed - Not Converted") {
        return "danger";
      } else if (status === "Stamp Duty") {
        return "info";
      }
    }
    // else{
    //   return 'secondary';
    // }
  };

  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "Client Name",
      prop: "clientname",
      isFilterable: true,
      cell: (row) => (
        <div>
          <Link to={`/oldlead/${row.id}`} state={row} className="name">
            {`${row.clientname}`}
          </Link>
        </div>
      ),
    },
    // {
    //   title: 'First Name', prop: 'firstname', isSortable: true, isFilterable: true,
    //   cell: (row) => (
    //     <Link
    //       to={"/leads/" + row.id}
    //       state={row}

    //     >
    //       {row.firstname}
    //     </Link>
    //   )
    // },
    // {
    //   title: 'Last Name', prop: 'lastname', isSortable: true, isFilterable: true,
    //   cell: (row) => (
    //     <Link
    //       to={"/leads/" + row.id}
    //       state={row}
    //     >
    //       {row.lastname}
    //     </Link>
    //   )
    // },
    // { title: 'Company', prop: 'company', isSortable : true, isFilterable: true },

    {
      title: "Status",
      prop: "leadstatus",
      isSortable: true,
      isFilterable: true,
      cell: (row) => {
        return (
          <Badge
            bg={getStatusClass(row.leadstatus)}
            style={{ display: "block", paddingBottom: "5px" }}
          >
            {row.leadstatus}
          </Badge>
        );
      },
    },
    {
      title: "Area",
      prop: "area",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Lead Ageing",
      prop: "leadageing",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Lead Created Date",
      prop: "leadcreateddate",
      isSortable: true,
      isFilterable: true,
      cell: (row) => moment(row.leadcreateddate).format("DD-MM-YYYY"),
    },
    {
      title: "Remarks",
      prop: "remarks",
      isSortable: true,
      isFilterable: true,
    },

    // { title: "Email", prop: "email", isSortable: true, isFilterable: true },
    // { title: "Phone", prop: "phone", isSortable: true, isFilterable: true },
    // // { title: 'Created By', prop: 'createdbyname', isSortable : true,  isFilterable: true },
    // {
    //   title: "Assigned Staff",
    //   prop: "ownername",
    //   isSortable: true,
    //   isFilterable: true,
    // },
    // {
    //   title: "Address",
    //   prop: "address",
    //   isSortable: true,
    //   isFilterable: true,
    //   cell: (row) => (
    //     <span>
    //       <div className="address">{`${row.street}, ${row.city}, ${row.pincode}, ${row.state}`}</div>
    //     </span>
    //   ),
    // },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createLead = () => {
    navigate(`/leads/e`);
  };

  return (
    <>
      <Container>
        <CustomSeparator
          // cmpListName="Report List"
          currentCmpName="All Imported Leads"
          indexLength="0"
          url="/leads"
        ></CustomSeparator>
        <Row className="g-0">
          <Col lg={12} className="px-4">
            <DatatableWrapper
              body={body}
              headers={header}
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 15,
                  options: [5, 10, 15, 20],
                },
              }}
              sortProps={{
                initialState: {
                  prop: "createddate",
                  order: "desc",
                },
              }}
            >
              <Row className="mb-4 row align-items-end">
                <Col
                  xs={12}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Filter />
                </Col>
                <Col xs={12} sm={6} lg={1} className="d-flex flex-col ">
                  <PaginationOptions labels={labels} />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                  <Form.Group className="mx-3 mt-4" controlId="formBasicStatus">
                    <Form.Select
                      aria-label="Enter status"
                      name="status"
                      onChange={onFilterType}
                    >
                      <option value="">--Select Type--</option>

                      {leadStatusArray.map((item, index) => (
                        <option value={item.label} key={index}>
                          {item.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg={2}>
                  <NewInfoPill left="Total" right={body?.length} />

                  {/* <InfoPill left="Total" right={body?.length} /> */}
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={2}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-sm"
                    variant="outline-primary"
                    onClick={() => setCSVModalShow(true)}
                  >
                    Import CSV / Excel
                  </Button>

                  {csvModalShow && (
                    <CSVSelector
                      show={csvModalShow}
                      onHide={() => setCSVModalShow(false)}
                      fetchData={() => setFetchData((prev) => !prev)}
                      // parentid={room.id}
                      // submitPricing={submitpricing}
                    />
                  )}
                </Col>
              </Row>
              {body ? (
                <Table striped className="data-table">
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
      </Container>
    </>
  );
};

export default OldLeadList;
