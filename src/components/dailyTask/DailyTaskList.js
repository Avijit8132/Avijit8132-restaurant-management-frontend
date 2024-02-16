import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment/moment";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import {DatatableWrapper,Filter,Pagination,PaginationOptions,TableBody,TableHeader,} from "react-bs-datatable";
import { Link } from "react-router-dom";
// import InfoPill from "./InfoPill";
import jwt_decode from "jwt-decode";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill"


const DailyTaskList = () => {

  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [dailytask, setDailyTask] = useState();

  const VerticalColors = {
    'Low': "#F2E962",      
    'Normal': "#89DA3D",        
    'Medium': "#3DDAC7",      
    'High': "#F04941",     
  };


  const [userInfo, setUserInfo] = useState(
    jwt_decode(localStorage.getItem("token"))
  );
  //.log('userInfo.userrole' , userInfo.userrole)

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchDailyTasks();
      //.log("result:", result);
      if (result) {
        setBody(result);
        setDailyTask(result);
      } else {
        setBody([]);
        setDailyTask([]);
      }
    }
    init();
  }, []);

  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(dailytask);
    } else {
      setBody(
        dailytask.filter((data) => {
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

  const header = [
    {
      title: "Title",
      prop: "title",
      isSortable: true,
      isFilterable: true,
      cell: (row) => (
        <Link to={"/dailytasklist/" + row.id} state={row}>
          {row.title}
        </Link>
      ),
    },
    {
      title: "Priority",
      prop: "priority",
      isSortable: true,
      isFilterable: true,
      cell: (row) => {
        return (
          <Badge
            bg={VerticalColors[row.priority]}
            style={{
              display: "block",
              borderRadius: "10px",
              //padding: "5px 5px",
              background: VerticalColors[row.priority],
              color: "black",
              fontWeight : 'bold',
              fontSize : '0.9rem',
              width:'100px'
            }}
          >
            {row.priority}
          </Badge>
        );
      },
    },
    {
      title: "Status",
      prop: "status",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Description",
      prop: "description",
      isSortable: true,
      isFilterable: true,
    },
    userInfo.userrole === "SUPER_ADMIN" && {
      title: "Assigned Staff",
      prop: "ownername",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Target Date",
      prop: "targetdate",
      isSortable: true,
      isFilterable: true,
      cell: (row) =>
        row.targetdate ? moment(row.targetdate).format("DD-MM-YYYY") : "",
    },
  ].filter(Boolean);
  
  const labels = {
    beforeSelect: " ",
  };

  const createProject = () => {
    navigate(`/dailytasklist/e`);
  };

  return (
    <Container>
      <CustomSeparator
        cmpListName="Report List"
        currentCmpName="Daily Task"
        indexLength="0"
        url="/dailytask"
      ></CustomSeparator>
    <Row className="g-0">
      
      <Col lg={12} className="px-4">
        {body ? (
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
            <Row className="mb-4 row align-items-end justify-content-between">
              <Col
                xs={12}
                lg={4}
                // className="d-flex flex-col justify-content-end align-items-end"
              >
                <Filter />
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={1}
                className="d-flex flex-col"
              >
                <PaginationOptions labels={labels} />
                </Col>
                <Col
                xs={12}
                sm={6}
                lg={2}>
                <NewInfoPill left="Total" right={body?.length} />

                {/* <InfoPill left="Total" right={body?.length} /> */}
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={2}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                {userInfo.userrole === "SUPER_ADMIN" ? <Button
                  className="btn-sm"
                  variant="outline-primary"
                  onClick={() => createProject(true)}
                >
                  New Daily Task
                </Button> : ""}
              </Col>
            </Row>
            <Table striped className="data-table">
              <TableHeader />
              <TableBody />
            </Table>
            <Pagination />
          </DatatableWrapper>
        ) : (
          <ShimmerTable row={10} col={8} />
        )}
      </Col>
      <Col lg={2}></Col>
    </Row>
    </Container>
  );
};

export default DailyTaskList;
