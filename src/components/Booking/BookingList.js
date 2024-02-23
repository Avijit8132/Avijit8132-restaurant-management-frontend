import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import Form from "react-bootstrap/Form";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Link } from "react-router-dom";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill";

const BookingList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contctTypeArray, setContactTypeArray] = useState(
    JSON.parse(localStorage.getItem("contact_type"))
  );

  useEffect(() => {
    async function init() {
      const bookings = await inventoryApi.fetchBookings();
      console.log("bookings --> ",bookings);
      if (bookings && bookings.length) {
        setBody(bookings);
        setBookings(bookings);
      } else {
        setBody([]);
      }
    }
    init();
  }, []);

  // ====== Filter on Type =======
  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(bookings);
    } else {
      setBody(
        bookings.filter((data) => {
          if (
            (data.type || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
        })
      );
    }
  };
  
  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "Booking No",
      prop: "auto_number",
      isFilterable: true,
      cell: (row) => (
        <div>
          <Link to={"/bookings/" + row.id} state={row} className="id">
            {row.auto_number}
          </Link>
        </div>
      ),
    },
    
    { title: "Status", prop: "status", isFilterable: true },
    { title: "Table Name", prop: "table_name", isFilterable: true },
    { title: "Contact Name", prop: "contact_name", isFilterable: true },
    { title: "Numberofperson", prop: "numberofperson", isFilterable: true },
    
  ];

  const labels = {
    beforeSelect: " ",
  };

  const createTable = () => {
    navigate(`/table/e`);
  };

  return (
    <Container>
      <CustomSeparator
        currentCmpName="Booking"
        indexLength="0"
        url="/bookings"
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
                lg={4}
              
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
                {/* <Form.Group controlId="formBasicStatus">
                  <Form.Select
                    aria-label="Enter Type"
                    name="type"
                    onChange={onFilterType}
                  >
                    <option value="">--Select Type--</option>
                    {contctTypeArray?.map((item, index) => (
                      <option value={item.label} key={index}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group> */}
              </Col>
              <Col
                xs={4}
                sm={6}
                lg={2}
                className="mt-3"
              >             
                <NewInfoPill left="Total" right={body?.length} />
              </Col>
              <Col
                xs={4}
                sm={6}
                lg={2}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button
                  className="btn-sm outline-primary"
                  variant="outline-primary"
                  onClick={() => createTable(true)}
                >
                  New Booking
                </Button>
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
        <Col lg={2}></Col>
      </Row>
    </Container>
  );
};

export default BookingList;
