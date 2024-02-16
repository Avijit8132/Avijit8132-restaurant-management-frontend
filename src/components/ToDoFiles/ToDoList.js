import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill"

import InputGroup from "react-bootstrap/InputGroup";
import { useLocation } from "react-router-dom";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Link } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";

const ToDoList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [body, setBody] = useState([]);
  const [filteredText, setFilteredText] = useState();
  const [filteredSlected, setfilteredSelected] = useState();


  const check = location.state;
  //.log("check-->", check);

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchTodos();
      //.log("result-->", result);
      if (result) {
        setBody(result);
      } else {
        setBody([]);
      }
    }
    init();
  }, []);

  const header = [
    {
      title: "Name",
      prop: "name",
      isFilterable: true,
      cell: (row) => (
        <Link
          to={"/TodoView/" + row.id}
          state={row}
        >
          {row.name}
        </Link>
      ),
      isSortable: true,
    },
    {
      title: "Details",
      prop: "details",
      isFilterable: true,
      cell: (row) => (
        <>
          <span>
            {row.details[0].name}... <br />
          </span>
        </>
      ),
    },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createTodo = () => {
    navigate(`/TodoNew`);
  };

  const handleFilter = (filterSelected, filterText) => {
    var filteredData = body;
    filteredData = body
      .filter((row) =>
        filterText
          ? row?.name?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
            row?.status?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
            String(row?.roomno)?.includes(filterText) ||
            row?.type?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
            row?.occupancy
              ?.toLowerCase()
              ?.includes(filterText?.toLowerCase()) ||
            row?.acnonac?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
            row?.floor?.toLowerCase()?.includes(filterText?.toLowerCase())
          : row
      )
      .filter((row) =>
        filterSelected
          ? (row.type || "").toLowerCase() ===
            (filterSelected || "").toLowerCase()
          : row
      );
    setBody(filteredData);
  };
  return (
    <Row className="g-0">
      <Col lg={2} className="mx-2">
        <Link className="nav-link">
          Home <i className="fa-solid fa-chevron-right"></i> todo
        </Link>
      </Col>

      <Col lg={12} className="p-lg-4">
        {body ? (
          <DatatableWrapper
            body={body}
            headers={header}
            paginationOptionsProps={{
              initialState: {
                rowsPerPage: 10,
                options: [5, 10, 15, 20],
              },
            }}
          >
            <Row className="mb-4 row align-items-end justify-content-between">
              <Col
                xs={12}
                lg={4}
                // className="d-flex flex-col justify-content-end align-items-end"
              >
                <Filter />
              </Col>
              <Col xs={12} sm={6} lg={1} className="d-flex flex-col ">
                <PaginationOptions labels={labels} />
              </Col>

              <Col xs={12} sm={6} lg={1} className="d-flex flex-col ">
                <NewInfoPill left="Total" right={body?.length} />

                {/* <InfoPill className="mt-4" left="Total" right={body?.length} /> */}
              </Col>

              <Col
                xs={12}
                sm={6}
                lg={3}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button
                  className="btn-sm"
                  variant="outline-primary"
                  onClick={() => createTodo()}
                >
                  New Todo
                </Button>
              </Col>
            </Row>
            <Table striped className="data-table">
              <TableHeader headers={header} />
              <TableBody headers={header} />
            </Table>
            <Pagination />
          </DatatableWrapper>
        ) : (
          ""
        )}
      </Col>
      {/* <Col lg={2}></Col> */}
    </Row>
  );
};

export default ToDoList;
