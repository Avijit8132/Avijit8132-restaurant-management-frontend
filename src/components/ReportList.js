import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table} from "react-bootstrap";
import {useNavigate} from 'react-router-dom'
import inventoryApi from "../api/inventoryApi";
import {
DatatableWrapper,
Filter,
Pagination,
PaginationOptions,
TableBody,
TableHeader
} from 'react-bs-datatable';
import moment from 'moment';
import CustomSeparator from "./Breadcrumbs/CustomSeparator";

import { Link } from "react-router-dom";



const ReportList = () => {


const [body, setBody] = useState([]);




useEffect(() => {
  async function init() {
    const reports = await inventoryApi.fetchReports();
    //.log(' =======',reports)
    if (reports) 
    //.log(reports);
    setBody(reports);
  }
  init();
}, []);

const header = [
    { title: 'Report Name', prop: 'name', isFilterable: true ,
    cell: (row) => (
      <Link
        to={"/reports/" + row.id}
        state={row}
      >
        {row.name}
      </Link>
    )
},
    { title: 'Created Date', prop: 'createddate', cell: (row) => (moment(row.createddate).format('DD-MM-YYYY')),isFilterable: true },
    { title: 'LastModified Date', prop: 'lastmodifieddate',cell: (row) => (moment(row.lastmodifieddate).format('DD-MM-YYYY')), isFilterable: true },
]

const labels = {
    beforeSelect: " "
  }
  return (
    <>
      <Container>
      <CustomSeparator 
      // cmpListName="Report List" 
      currentCmpName="Report Name"
      indexLength="0"
      url="/reports" > 
      </CustomSeparator>
      </Container>

      <Row className="g-0">
        {/* <Col lg={2} className="mx-2">
          <Link className="nav-link">Home <i class="fa-solid fa-chevron-right"></i> Reports</Link>
        </Col> */}
        <Col lg={12} className="px-4">

          {body ?
            <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
              initialState: {
                rowsPerPage: 10,
                options: [5, 10, 15, 20]
              }
            }}>
              <Row className="mb-4">
                <Col
                  xs={12}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Filter />
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-start align-items-start"
                >
                  <PaginationOptions labels={labels} />
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  {/* <Button className="btn-sm" variant="outline-primary" >New Report</Button> */}
                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />

            </DatatableWrapper> : ''}
        </Col>
        <Col lg={2}></Col>
      </Row>
    </>
  )
}

export default ReportList
