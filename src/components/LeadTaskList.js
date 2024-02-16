import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader,
  } from "react-bs-datatable";import inventoryApi from "../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import NewInfoPill from "./common/NewInfoPill/NewInfoPill";
import CustomSeparator from "./Breadcrumbs/CustomSeparator";
import { Link } from "react-router-dom";

const LeadTaskList = () => {
    const [body, setBody] = useState([]);

    useEffect(() => {
        taskList();    
      }, []);
      
      const taskList = () => {
        async function init() {
          let leadTasks = await inventoryApi.fetchLeadsTask();
          //.log(leadTasks);
          if (leadTasks && leadTasks?.length > 0) {
            setBody(leadTasks);
          } else {
            setBody([]);
          }
        }
        init();
      }
    const header = [
      
        {title: 'Title', prop: 'title', isFilterable: true,},
        {
          title: "Lead name",
          prop: "leadname",
          isFilterable: true,
          cell: (row) => (
           
            <div>
             <Link to={"/leads/" + row.parentid} state={{id:  row.parentid}} className="name">
                {row.leadname}             
              </Link>
            </div>
          ),
        },
        { title: 'Task Type', prop: 'type', isFilterable: true, cell: (row) => ( row.type ? row.type: "") },
        { title: 'Priority', prop: 'priority', isFilterable: true, cell: (row) => ( row.priority ? row.priority: "") },
        { title: 'Description', prop: 'description', isFilterable: true,  cell: (row) => ( row.type !== 'Email' ? <div class="task-list-description">{row.description}</div>: "") },
        { title: 'Status', prop: 'status',isFilterable: true, },
        { title: 'Target Date', prop: 'targetdate', isFilterable: true,cell: (row) => (moment(row.targetdate).format('DD-MM-YYYY')) },
        { title: 'Created Date', prop: 'createddate', isFilterable: true,cell: (row) => (moment(row.createddate).format('DD-MM-YYYY')) },
        { title: 'Created By', prop: 'createdbyname' },
      ];
    
      const labels = {
        beforeSelect: " ",
      };

      return (
        <Container>
          <CustomSeparator
            currentCmpName="Lead Task List"
            indexLength="0"
            url="/leadTaskList"
          ></CustomSeparator>
    
          <Row className="g-0">
            <Col lg={12} className="px-4">
              <DatatableWrapper
                body={body}
                headers={header}
                paginationOptionsProps={{
                  initialState: {
                    rowsPerPage: 10,
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
                <Row className="mb-4 align-items-end justify-content-between">
                <Col
                 xs={6}
                 sm={6}
                 lg={3}
                 className="mt-2">
                   <Filter/>
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
                    sm={6}
                    lg={1}
                    className="mt-3"
                  >             
                    <NewInfoPill left="Total" right={body?.length} />
                  </Col>
                </Row>
                <Row>  
                  <Col>
                  {body ? (
                    <Table striped className="data-table">
                      <TableHeader />
    
                      <TableBody />
                    </Table>
                  ) : (
                    <ShimmerTable row={10} col={8} />
                  )}
                  </Col> 
                </Row>
                <Pagination />
              </DatatableWrapper>          
            </Col>
          </Row>
        </Container>
      );
}

export default LeadTaskList

