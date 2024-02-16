import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table, Container, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
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
import Badge from "react-bootstrap/Badge";
import NewInfoPill from "../common/NewInfoPill/NewInfoPill"

const PropertyList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [properties, setProperties] = useState();
  const [filterObj, setFilterObj] = useState({});
  const [optionProject, setOptionProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [firstDropdownOptions, setFirstDropdownOptions] = useState([
    "Name", 
    "Property Base",
    "Location",
    "Possession Status",
    "Property Transaction Type",
    "Property Type",
    "Area to from",
  ]);
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);
  const [firstDropdownValue, setFirstDropdownValue] = useState("");

  const [filterType, setFilterType] = useState("");
  const [textInputValue, setTextInputValue] = useState("");
  const VerticalColors = {
    Office: "#82eedd",
    Land: "#c9ee82",
    Retail: "#ff80ed",
    Investment: "#e3c6ff",
    Logistic: "#00d5ff",
    Warehouse: "#d0ae8b",
    Others: "#7f72a2",
  };

  useEffect(() => {
    async function init() {
      const result = await inventoryApi.fetchProperties();
      if (result) {
        setBody(result);
        setProperties(result);
      } else {
        setBody([]);
        setProperties([]);
      }
      let projectList = await inventoryApi.fetchProjects();

      if (projectList && projectList.length) {
        let ar = projectList.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setOptionProject(ar);
      } else {
        setOptionProject([]);
      }
    }
    init();
  }, []);

  useEffect(() => {
    onFilterType();
  }, [filterObj]);

  const onFilterType = () => {
    if (properties) {
      if (firstDropdownValue && filterObj.secondDropdownValue) {
        const tempData = properties.filter((item) => {
          if (firstDropdownValue === "Property Base") {
            return item.propertybase === filterObj.secondDropdownValue;
          }
          if (firstDropdownValue === "Possession Status") {
            return item.possessionstatus === filterObj.secondDropdownValue;
          }
          if (firstDropdownValue === "Property Transaction Type") {
            return item.transactiontype === filterObj.secondDropdownValue;
          }
          if (firstDropdownValue === "Property Type") {
            return item.propertytype === filterObj.secondDropdownValue;
          }
          return true;
        });

        setBody(tempData);
      } else if (firstDropdownValue) {
        setBody(properties);
      }
    }
  };

  const handleChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFirstDropdownValue(selectedType);
    setFilterObj({
      ...filterObj,
      type: selectedType,
      secondDropdownValue: "",
    });
    let secondDropdownOptions = [];

    switch (selectedType) {
      case "Property Base":
        secondDropdownOptions = ["Area wise", "sq. feet/meter"];
        break;
      case "Possession Status":
        secondDropdownOptions = [
          "Not Available",
          "Available",
          "Ready to Move",
          "Under Construction",
        ];
        break;
      case "Property Transaction Type":
        secondDropdownOptions = ["Sale", "Lease", "Rent", "Investment"];
        break;
      case "Property Type":
        secondDropdownOptions = ["Commercial", "Sale","Lease","Rent","Investiment","Additional Rooms","Facing"];
        break;
      default:
        secondDropdownOptions = [];
        break;
    }

    //for select type
    if (!selectedType) {
      setBody(properties);
    }

    setSecondDropdownOptions(secondDropdownOptions);
  };

  const handleSecondDropdownChange = (e) => {
    const selectedValue = e.target.value;
    setFilterObj({ ...filterObj, secondDropdownValue: selectedValue });
  };

  const handleTextInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setTextInputValue(inputValue);
  
    const tempData = properties.filter((item) => {
      let itemValue = "";
      if (filterObj.type === "Location") {
        itemValue =
          (item["city"] || "").toString().toLowerCase() +
          (item["street"] || "").toString().toLowerCase() +
          (item["state"] || "").toString().toLowerCase() +
          (item["pincode"] || "").toString().toLowerCase();
      } else if (filterObj.type === "Area to from") {
        if (item["areatofrom"] !== null) {
          itemValue = item["areatofrom"].toString().toLowerCase();
        }
      } else if (filterObj.type === "Name") {
        itemValue = (item["name"] || "").toString().toLowerCase().trim();
      }
  
      return itemValue.includes(inputValue);
    });
  
    setBody(tempData);
  };
  

  // Create table headers consisting of 4 columns
  const header = [
    {
      title: "Property Name",
      prop: "name",
      isSortable: true,
      isFilterable: true,
      cell: (row) => (
        <Link to={"/properties/" + row.id} state={row}>
          {row.name}
        </Link>
      ),
    },
    {
      title: "Vertical",
      prop: "vertical",
      isSortable: true,
      isFilterable: true,
      cell: (row) => {
        return (
          <Badge
           bg={row.vertical !== null ?  row.vertical === "Logistic and Warehouse" ? "#E8EB96" : VerticalColors[row.vertical] : ""}
            style={{
              display: "block",
              paddingBottom: "5px",
              backgroundColor: row.vertical === "Logistic and Warehouse" ? "#E8EB96" : VerticalColors[row.vertical],
              color: "black",
              fontWeight : 'bold',
              fontSize : '0.9rem'
            }}
          >

            {row.vertical}
          </Badge>
        );
      },
    },
    {
      title: "Contact",
      prop: "contactname",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Possession Status",
      prop: "possessionstatus",
      isSortable: true,
      isFilterable: true,
    },
    {
      title: "Address",
      prop: "state",
      isSortable: true,
      isFilterable: true,
    },
  ];

  const labels = {
    beforeSelect: " ",
  };

  const createProperty = () => {
    navigate(`/properties/e`);
  };

  return (
    <Container>
      <CustomSeparator
        currentCmpName="Inventory"
        indexLength="0"
        url="/properties"
      ></CustomSeparator>
      <Row className="g-0 ">
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
                initialState: {
                  prop: "createddate",
                  order: "desc",
                },
              }}
            >
              <Row className="mb-4 row align-items-end justify-content-between">
                <Col
                  lg={2}
                  xs={6}
                  sm={6}
                  className="mt-3"
                >
                  <Form.Group controlId="formBasicFilterType">
                    <Form.Select
                      aria-label="Select Filter Type"
                      name="type"
                      onChange={handleChange}
                      className="select-dropdown-1"
                    >
                      <option value="">--Select Type--</option>
                      {firstDropdownOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* {filterType === "Name" && (
                  <Col
                    lg={3}
                    xs={6}
                    sm={4}
                    className="d-flex flex-col justify-content-end align-items-end"
                  >
                    <Filter />
                  </Col>
                )} */}

                <Col
                  lg={3}
                xs={6}
                sm={6}
                className="mt-3"
                >
                  {secondDropdownOptions.length > 0 && (
                    <Form.Group controlId="formBasicSecondFilter">
                      <Form.Select
                        aria-label="Select Second Filter"
                        name="secondDropdownValue"
                        onChange={handleSecondDropdownChange}
                        className="select-dropdown-2"
                      >
                        <option value="">--Select Second Filter--</option>
                        {secondDropdownOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                  {filterType === "Location" ||
                  filterType === "Area to from" || filterType === "Name" ? (
                    
                    <Form.Group
                      className="mx-3"
                      controlId="formBasicTextInput"
                     
                    >
                     <InputGroup >
                      <Form.Control          
                        type="text"
                        name="inputTypeValue"
                        placeholder={`Enter ${filterType}`}
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
                            setBody(properties);
                          }}>X</Button>
                     
                     </InputGroup>
                    </Form.Group>
                  ) : null}
                  
                </Col>
                <Col lg={1} xs={2} sm={1} className="">
                  <PaginationOptions labels={labels} />
                </Col>
                <Col lg={2} xs={2} sm={6} className="mt-4">
                  <div>
                    <NewInfoPill left="Total" right={body?.length} />
                  </div>
                </Col>
                <Col
                  lg={2}
                  xs={8}
                  sm={6}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    style={{}}
                    className="btn-sm outline-primary"
                    variant="outline-primary"
                    onClick={() => createProperty(true)}
                  >
                    New Inventory
                  </Button>
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

export default PropertyList;
