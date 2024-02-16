import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table,Tooltip,OverlayTrigger } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import inventoryApi from "../../api/inventoryApi";
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
import authApi from "../../api/authApi";
import jwt_decode from "jwt-decode";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill";

const UserList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [leadname, setLeadName] = useState();
  const [userInfo, setUserInfo] = useState(jwt_decode(localStorage.getItem('token')));
  // const[contact,setContact] = useState(location.state ? location.state : {});
  const [lead, setLead] = useState();
  //////.log('location.state ='+location.state)

  useEffect(() => {
    
    async function init() {
      const users = await inventoryApi.fetchUsers();
      //.log('users',users)
      let resultWithoutSuperAdmin = [];
      if (userInfo.userrole === 'ADMIN' || userInfo.userrole === 'USER') {
        resultWithoutSuperAdmin = users.filter((value, index, array) => value.userrole !== 'SUPER_ADMIN');
        setBody(resultWithoutSuperAdmin);
      } else {
        setBody(users);
      }
      if (users) {
        ////.log("user data =>", users);
        setLead(users);
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


  const editUser = (row) => {
    ////.log("row", row);
    navigate(`/users/${row.row.id}/e`, { state: row.row });
  }
  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "Name",
      prop: "username",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/users/" + row.id} state={row}>
          {row.username}
        </Link>
      ),
    },
    { title: "Role", prop: "userrole", isFilterable: true },
    { title: "Phone", prop: "phone", isFilterable: true },
    { title: "Email", prop: "email", isFilterable: true },
    {
      title: "Active", prop: "isactive", isFilterable: true,
      cell: (row) => (

        row.isactive === true ? 'Active' : 'Inactive'

      )
    },
    {
      title: "Actions",
      prop: "id",
      cell: (row) => (
        <OverlayTrigger
        placement="top"
        overlay={<Tooltip className="my-tooltip">Edit</Tooltip>}
      >
        <Button className="btn-sm mx-2 " onClick={() => editUser({ row })}>
          <i className="fa-regular fa-pen-to-square "></i>
        </Button>
        </OverlayTrigger>
      ),
    },

  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createUser = () => {
    navigate(`/users/e`);
  };

  return (
    <Row className="g-0">
     <Col lg={2} className="mx-2 ps-3">
      <CustomSeparator 
      // cmpListName="Report List" 
      currentCmpName="Users"
      indexLength="0"
      url="/users" > 
      </CustomSeparator>
      </Col>
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
            initialState : {
            prop: "createddate",
            order: "desc"
          }
        
          }}
        >
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
              <PaginationOptions labels={labels} /> &nbsp; &nbsp;

            <NewInfoPill left="Total" right={body?.length} />
            </Col>
            
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              
              <Button
                className="btn-sm"
                variant="outline-primary mx-2"
                onClick={() => createUser(true)}
              >
                New User
              </Button>
             
              {/* <Button className="btn-sm" variant="outline-primary" onClick={()=>location.state ? navigate(`/contacts/${contact.id}`) : navigate('/contacts/')}>Back to Contact</Button> */}
            </Col>
          </Row>
          {body.length > 0 ? (
            <Table striped className="data-table" responsive = "sm">
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
export default UserList;
