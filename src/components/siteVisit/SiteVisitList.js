import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import Form from "react-bootstrap/Form";
import { ShimmerTable } from "react-shimmer-effects";
import Badge from "react-bootstrap/Badge";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Link } from "react-router-dom";
import InfoPill from "../common/InfoPill";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill";

const SiteVisitList = () => {

  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchSiteVisits();

      //.log("siteVisits--->", siteVisits);
      if (result) {
        setBody(result);
        setSiteVisits(result);
      } else {
        setSiteVisits([]);
      }
    }
    init();
  }, []);



  // ====== Filter on status =======
  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(siteVisits);
    } else {
      setBody(
        siteVisits.filter((data) => {
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

    if (status) {
      if (status === "Not Visited") {
        //.log("status open", status);
        return "primary";
      } else if (status === "Visited") {
        return "warning";
      } else if (status === "Checked In") {
        return "success";
      } else if (status === "Checked Out") {
        return "danger";
      }
    }
    // else{
    //   return 'secondary';
    // }
  };

  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "Site",
      prop: "sitename",
      isFilterable: true,
      cell: (row) => (
        <div>
          <Link to={"/sitevisit/" + row.id} state={row} className="name">
            {`${row.sitename}`}
          </Link>
        </div>
      ),
    },
    {
      title: "Field Person",
      prop: "fieldpersonname",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Status",
      prop: "status",
      isSortable: true,
      isFilterable: true,
      cell: (row) => {
        return (
          // <Badge
          //   bg={getStatusClass(row.status)}
          //   style={{ display: "block", paddingBottom: "5px" }}
          // >
          //   {row.status}
          // </Badge>
          <span>{row.status}</span>
        );
      },
    },
    // {
    //   title: "Assigned Staff",
    //   prop: "ownername",
    //   isSortable: true,
    //   isFilterable: true,
    // },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createLead = () => {
    navigate(`/sitevisit/e`);
  };

  return (
      <Container>
        <CustomSeparator
          // cmpListName="Report List"
          currentCmpName="Site Visit"
          indexLength="0"
          url="/sitevisit"
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
                initialState : {
                prop: "createddate",
                order: "desc"
              } }}
            >
            <Row className="mb-4 align-items-end justify-content-between">
                <Col
                  xs={6}
                  sm={6}
                  lg={4}
                  className="mt-2"
                >
                  <Filter />
                </Col>
                <Col
                 xs={2}
                 sm={2}
                 lg={1}
                 className="mt-2"
                 >
                  <PaginationOptions labels={labels} />
              </Col>
                <Col
                xs={4}
                sm={4}
                lg={2}
                className="mt-2"
                >
                  <Form.Group className="mx-3" controlId="formBasicStatus">
                    <Form.Select
                      aria-label="Enter status"
                      name="status"
                      onChange={onFilterType}
                    >
                      <option value="">-- Select Status --</option>

                      {/* {leadStatusArray.map((item, index) => ( */}
                        <option value="Not Visited">Not Visited</option>
                        <option value="Visited">Visited</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Checked Out">Checked Out</option>
                    {/*    ))} */}
                    </Form.Select>
                  </Form.Group>
                  </Col>
                  <Col
                  xs={4}
                  sm={6}
                  lg={2}
                  className="mt-3">
                  {/* <InfoPill left="Total" right={body?.length} /> */}
                  <NewInfoPill left="Total" right={body?.length} />
                </Col>
                <Col
                  xs={8}
                  sm={4}
                  lg={2}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-sm outline-primary"
                    variant="outline-primary"
                    onClick={() => createLead(true)}
                  >
                    New Site Visit
                  </Button>
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
  );
};

export default SiteVisitList;
