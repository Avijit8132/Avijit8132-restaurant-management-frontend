import React, { useState, useEffect,  forwardRef, useImperativeHandle, useRef  } from 'react'
import { Badge, Button, Col, Row, Table,Tooltip,OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import parse from "html-react-parser";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader
} from 'react-bs-datatable';

import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import inventoryApi from '../api/inventoryApi';

const RelatedListArea = ({parent, refreshAreaList}) => {

console.log('areaaaa',parent.id);
  // Create table headers consisting of 4 columns.
  
  const [body, setBody] = useState([]);

  useEffect(() => {
    areaList();
    
  }, [refreshAreaList]);
  
  const areaList = () => {
    console.log('insidde',parent.id);
    async function init() {
      let areaDetailList = await inventoryApi.fetchPropertyDetails(parent.id);
      if (areaDetailList && areaDetailList?.length > 0) {
        console.log('areaDetailList', areaDetailList);
            const filteredAreaList = areaDetailList.filter(area => area.type === "area");
            if (filteredAreaList.length > 0) {
                setBody(filteredAreaList);
            }
            else {
                setBody([]);
        }
      } else {
        setBody([]);
      }
    }
    init();
  }

  const labels = {
    beforeSelect: " "
  }

  const header = [
    {
      title: 'Area', prop: 'area',
    },
    { title: 'Type', prop: 'type', cell: (row) => ( row.type ? row.type: "") },
    // { title: 'Description', prop: 'description', cell: (row) => ( row.description? parse(row.description): "") },

    { title: 'Floor', prop: 'floor' },
    { title: 'Unit', prop: 'unit' },
    { title: 'Value', prop: 'value'},
  ];


  return (
    <>
      {body ?
        <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
          initialState: {
            rowsPerPage: 5
          }
        }}>
          <Row className="mb-4">
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-start"
            >


            </Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-start"
            >


            </Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
            </Col>
          </Row>
          <Table striped className="related-list-table">
            <TableHeader />
            <TableBody rowKey="id" />
          </Table>
          <Pagination />
        </DatatableWrapper> : ''}
    </>
  )
};

export default RelatedListArea;