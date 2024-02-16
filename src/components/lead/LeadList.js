import React, { useEffect, useState } from "react";
import { Button, Col, Container, InputGroup, Row, Table } from "react-bootstrap";
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
import CustomSeparator from "../Breadcrumbs/CustomSeparator";
import moment from "moment/moment";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill";

const LeadList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [leads, setLeads] = useState([]);
  const [firstDropdownOptions, setFirstDropdownOptions] = useState(['Name', 'Assigned Staff', 'Stage', 'Location']);
  const [firstDropdownValue, setFirstDropdownValue] = useState("");
  const [filterObj, setFilterObj] = useState({});
  const [filterType, setFilterType] = useState("no filter");
  const [textInputValue, setTextInputValue] = useState("");
  const [filterLeads, setFilterLeads] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [sortFilter, setSortFilter] = useState()

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchLeads();
      //.log('hello',result);
      if (result) {
        if (result.length  >= 0){
          let sortedLeads = [...result];
                          sortedLeads.sort((a, b) =>
                            moment(b.lastmodifieddate).diff(moment(a.lastmodifieddate))
                          );
          setBody([...sortedLeads]);
         
          setLeads(result);
          setFilterLeads(result)
        }
      } 
    }
    init();
  }, []);

  useEffect(() => {
    
    async function init() {
      const users = await inventoryApi.fetchUsers();
      //.log('users',users)
      if(users.length>0) setAllUsers(users);
    }
    init();
  }, []);

  const handleChange = (e) => {

    //.log("filte type --> ",e.target.value);

    setFilterType(e.target.value);

    // setFilterObj()

    // if(e.target.value === "no filter"){
      setBody(leads)
      setTextInputValue("")
    // } 

    if(sortFilter !== "no filter") handleSortFilter(sortFilter)

    // let secondDropdownOptions = [];
    // switch (selectedType) {
    //   case "Property Base":
    //     secondDropdownOptions = ["Area wise", "sq. feet/meter"];
    //     break;
    //   case "Property Status":
    //     secondDropdownOptions = [
    //       "Not Available",
    //       "Available",
    //       "Ready to Move",
    //       "Under Construction",
    //     ];
    //     break;
    //   case "Property Transaction Type":
    //     secondDropdownOptions = ["Sale", "Lease", "Rent", "Investment"];
    //     break;
    //   case "Property Type":
    //     secondDropdownOptions = ["Commercial", "Industrial"];
    //     break;
    //   default:
    //     secondDropdownOptions = [];
    //     break;
    // }
  };

  const handleFilter = (e) => {

    if(filterType === "Assigned Staff"){
      setBody(leads.filter((lead) => (
        lead.ownername === e.target.value
      )))
    }
    else if(filterType === "Stage"){
      setBody(leads.filter((lead) => (
        lead.leadstage === e.target.value
      )))
    }

    handleSortFilter(sortFilter)
  }

  const handleTextInputChange = (e) => {

    const inputValue = e.target.value;
    setTextInputValue(e.target.value);
    const tempData = filterLeads.filter((item) => {
      let itemValue = "";
      if (filterType === "Location") {
        itemValue =
          (item["clientstreet"] || "").toLowerCase().trim() +
          (item["clientcity"] || "").toLowerCase().trim() +
          (item["clientpincode"] || "").toLowerCase().trim() +
          (item["clientstate"] || "").toLowerCase().trim();

        return itemValue.trim().includes(inputValue.toLowerCase());
      } else if (filterType === "Name") {
        itemValue =
          (item["customername"]).toLowerCase().trim()

          //.log("customer name --> ",item["customername"]);
          //.log("filter logic --> ",itemValue.toLowerCase().includes(inputValue.toLowerCase().trim()));

        return itemValue.toLowerCase().includes(inputValue.toLowerCase().trim());
      }

    });
    setBody(tempData);

    handleSortFilter(sortFilter)
  };

  const handleSortFilter = (sort) => {

    if (sort === "lastly") {
 
      setBody((prev) => prev.sort(
        (objA, objB) => Number(new Date(objA.createddate)) - Number(new Date(objB.createddate)),
      ));
    } else if (sort === "newly") {
      setBody((prev) => prev.sort(
        (objA, objB) => Number(new Date(objB.createddate)) - Number(new Date(objA.createddate)),
      ));
    }
  }
 

  const VerticalColors = {
    'Open': "#8E969C", 
    'Close': "#C5E7E2", 
    'Pending': "#EDF0A7", 
    'Negotiation Stage': "#A9D1D7",      
    'Due Diligence Stage': "#A1DAD7",        
    'Upload File Stage': "#8BD0D0",      
    'Tenure': "#6BAAAE",  
    'Neighboring Brands': "#B4D3C4",    
    'Stamp Duty': "#ADC3B4",  
    'Registration Cost': "#8C9FA0",      
    'Maintenance Charges': "#00C0A3",      
    'Possession Timeline': "#30949D",   
  };

  const header = [
    {
      title: "Name",
      prop: "customername",
      isFilterable: true,
      cell: (row) => (
        <div>
          <Link to={"/leads/" + row.id} state={row} className="name">
            {row.customername}
          </Link>
        </div>
      ),
    },
    
    {
      title: "Stage",
      prop: "leadstage",
      isFilterable: true,
      cell: (row) => {
        return (
         <Badge
            bg={row.leadstage !== null ?  row.leadstage === "test leadstage" ? "#FAC2A4" : VerticalColors[row.leadstage] : ""}
            // bg={row.leadstage !== null ?  VerticalColors[row.leadstage] : ""}
            style={{
              display: "block",
              borderRadius: "15px",
              padding: "5px 5px",
              backgroundColor: row.leadstage === "test leadstage" ? "#FAC2A4" : VerticalColors[row.leadstage],
              // background: VerticalColors[row.leadstage],
              color: "black",
              fontWeight : 'bold',
              fontSize : '0.9rem',
              width:'200px'
            }}
          >
            {row.leadstage}
          </Badge>
        );
      },
    },

    // { title: "Email", prop: "email", isFilterable: true },
    // {
    //   title: "Phone",
    //   prop: "phone",
    //   isFilterable: true,
    // },
    {
      title: "Assigned Staff",
      prop: "ownername",
      isFilterable: true,
    },
    // {
      //   title: "Area From To",
      //   prop: "areaaddress",
    //   isSortable: true,
    //   isFilterable: true,
    //   cell: (row) => (
    //     <span>
    //      {row.areavaluein &&  row.areafrom && row.areato &&
    //      <div className="areaaddress">{`${ row.areafrom}-${ row.areato} ${ row.areavaluein }  `}</div>
    //      }
    //      </span>
    //   ),
    // },
    {
      title: "Lead Source",
      prop: "leadsource",
      isFilterable: true,
    },
    {
      title: "Created Date",
      prop: "createddate",
      isFilterable: true,
      cell: (row) => (
        <>
        {moment(row.createddate).format("DD-MM-YYYY")}
        </>
      )
    },
    {
      title: "Address",
      prop: "address",
      isFilterable: true,
      cell: (row) => (
        <span>
         <div className="address">{`${(row.clientstreet != null && row.clientstreet !== '') ? row.clientstreet + ',' : ''} ${(row.clientcity != null && row.clientcity !== '' )? row.clientcity + ',' : ''} ${(row.clientpincode != null && row.clientpincode !== '' )? row.clientpincode + ',' : ''} ${row.clientstate != null ? row.clientstate : ''}`}</div>
        </span>
      ),
    },
  ];
  const labels = {
    beforeSelect: " ",
  };

  const createLead = () => {
    navigate(`/leads/e`);
  };

  return (
      <Container>
        <CustomSeparator
          currentCmpName="Leads"
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
              
            >
              <Row className="mb-4 align-items-end justify-content-between">

              <Col 
                lg={2}
                xs={6}
                sm={6}
                className="mt-3">
                  <Form.Group
                    controlId="formBasicFilterType"
                  >
                    <Form.Select
                      aria-label="Select Filter Type"
                      name="type"
                      onChange={handleChange}
                      className="select-dropdown-1"
                    >
                      <option value='no filter'>Select Filter Type</option>
                      {firstDropdownOptions.map((option) => (
                        <option key={option} value={option}>
                        {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

              {filterType !== "no filter" ?
              <Col
                lg={3}
                xs={6}
                sm={6}
                className="mt-3">
                {filterType === "Assigned Staff" ? (

                  <Form.Group
                    controlId="formBasicFilterType"
                  >
                    <Form.Select
                      aria-label="Select Filter Type"
                      name="type"
                      onChange={(e) => handleFilter(e)}
                      className="select-dropdown-1"
                    >
                      <option value=''>-- Select Assigned Staff --</option>
                      {allUsers.length > 0 && allUsers.map((user) => (
                        <option value={user.username}>{user.username}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                ) : filterType === "Stage" ?

                  <Form.Group
                    controlId="formBasicFilterType"
                  >
                    <Form.Select
                      aria-label="Select Filter Type"
                      name="type"
                      onChange={(e) => handleFilter(e)}
                      className="select-dropdown-1"
                    >
                      <option value=''>-- Select Lead Stage --</option>
                      <option value="Open">Open</option>
                     <option value="Close">Close</option>
                     <option value="Pending">
                          Pending
                     </option>
                      <option value="Negotiation Stage">
                        Negotiation Stage
                      </option>
                      <option value="Due Diligence Stage">
                        Due Diligence Stage{" "}
                      </option>
                      <option value="Upload File Stage">
                        Upload File Stage
                      </option>
                      <option value="Tenure">Tenure</option>
                      <option value="Neighboring Brands">
                        Neighboring Brands
                      </option>
                      <option value="Stamp Duty">
                        Stamp Duty
                      </option>
                      <option value="Registration Cost">
                        Registration Cost
                      </option>
                      <option value="Maintenance Charges">
                        Maintenance Charges
                      </option>
                      <option value="Possession Timeline">
                        Possession Timeline
                      </option>
                    </Form.Select>
                  </Form.Group>
                  :

                  <Form.Group
                    controlId="formBasicTextInput"
                  >
                 <InputGroup >
                    <Form.Control
                      type="text"
                      name="inputTypeValue"
                      disabled={filterType === ''}
                      placeholder={`Enter ${filterType}...`}
                      value={textInputValue}
                      onChange={handleTextInputChange}
                    />
                    
                      <Button className="btn-danger"
                       onClick={()=>{
                        setTextInputValue('');
                        setFilterObj({
                          ...filterObj,
                          secondDropdownValue: "",
                        });
                        setBody(leads);
                       }}>X</Button>
                      </InputGroup>
                   </Form.Group>
                }
                </Col>
                : undefined}

                <Col 
                lg={1}
                xs={2}
                sm={2}
                className="mt-2">
                  <PaginationOptions labels={labels} />
                </Col>

                <Col  
                lg={2}
                xs={3}
                sm={3}
                className="mt-2">
                  <Form.Group controlId="formBasicStatus">
                    <Form.Select
                      aria-label="Select option"
                      onChange={(e) => {

                        setSortFilter(e.target.value)

                        handleSortFilter(e.target.value)

                        // let sortedLeads = [...body];

                        // if (e.target.value === "newly") {
                        //   sortedLeads.sort((a, b) =>
                        //     moment(b.createddate).diff(moment(a.createddate))
                        //   );
                        // } else if (e.target.value === "lastly") {
                        //   sortedLeads.sort((a, b) =>
                        //     moment(a.createddate).diff(moment(b.createddate))
                        //   );
                        // } 
                        // else {
                        //   setBody(body);
                        // }

                        // setBody([...sortedLeads]);
                        // setFilterLeads([...sortedLeads])

                      }}
                    >
                      <option value="no filter">--Sort Lead--</option>
                      <option value="newly">Newest</option>
                      <option value="lastly">Oldest</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col  
                lg={2}
                xs={4}
                sm={4}
                className="mt-3 d-flex flex-col justify-content-start align-items-end"
               >
                  <NewInfoPill left="Total" right={body?.length} />
                </Col>

                <Col
                lg={2}
                xs={3}
                sm={3}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-sm outline-primary"
                    variant="outline-primary"
                    onClick={() => createLead(true)}
                  >
                    New Lead
                  </Button>
                </Col>
              </Row>
              <Row>  
              <Col>
              {body ? (
                <Table responsive striped className="data-table">
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

export default LeadList;
