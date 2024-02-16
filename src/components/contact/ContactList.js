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

const ContactList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contctTypeArray, setContactTypeArray] = useState(
    JSON.parse(localStorage.getItem("contact_type"))
  );

  useEffect(() => {
    async function init() {
      const contacts = await inventoryApi.fetchContacts();
      if (contacts && contacts.length) {
        setBody(contacts);
        setContacts(contacts);
      } else {
        setBody([]);
      }
    }
    init();
  }, []);

  // ====== Filter on Type =======
  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(contacts);
    } else {
      setBody(
        contacts.filter((data) => {
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
      title: "Name",
      prop: "contactname",
      isFilterable: true,
      cell: (row) => (
        <div>
          <Link to={"/contacts/" + row.id} state={row} className="name">
            {row.contactname}
          </Link>
        </div>
      ),
    },
    
    { title: "Email", prop: "email", isFilterable: true },
    { title: "Contact Type", prop: "type", isFilterable: true },
    { title: "Phone", prop: "phone", isFilterable: true },
    
    {
      title: "Address",
      prop: "address",
      isSortable: true,
      isFilterable: true,
      cell: (row) => (
        <span>
          <div className="address">{`${
            row.street != null && row.street !== "" ? row.street + "," : ""
          } ${row.city != null && row.city !== "" ? row.city + "," : ""} ${
            row.pincode != null && row.pincode !== "" ? row.pincode + "," : ""
          } ${row.state != null ? row.state : ""}`}</div>
        </span>
      ),
    },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createContact = () => {
    navigate(`/contacts/e`);
  };

  return (
    <Container>
      <CustomSeparator
        currentCmpName="Contacts"
        indexLength="0"
        url="/contacts"
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
                <Form.Group controlId="formBasicStatus">
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
                </Form.Group>
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
                  onClick={() => createContact(true)}
                >
                  New Contact
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

export default ContactList;
