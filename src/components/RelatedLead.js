import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader, } from "react-bs-datatable";
import inventoryApi from "../api/inventoryApi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Confirm from "./common/Confirm";

const RelatedLead = ({ parent, refreshPatientTestsList }) => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const [reletedLead, setReletedLead] = React.useState("");
  const [modalShowPatientTests, setModalShowPatientTests] =
    React.useState(false);
  const [modalShowPatientTestsView, setModalShowPatientTestsView] =
    React.useState(false);
  const [modalShowLead, setModalShowLead] = useState(false);
  // Create table headers consisting of 4 columns.
  const [body, setBody] = useState([]);
  useEffect(() => {
    relatedLeadList();
  }, []);



  const relatedLeadList = () => {
    async function init() {
      //.log("parent.id... ", parent.id);
      let parentLeadList = await inventoryApi.findByLeadId(
        parent.id
      );
      //.log('parentLeadList...', parentLeadList)
      if (parentLeadList && parentLeadList?.length > 0) {
        setBody(parentLeadList);
      } else {
        setBody([]);
      }
    }
    init();
  };
  const handleDelete = (row) => {
    setModalShow(true);
    setReletedLead(row);
  };
  const editLead = (row) => {
    setModalShowLead(true);
    //.log("Edit");
    setReletedLead(row);
    //.log("Row stringify" , row);
    navigate(`/leads/${row.id}/e`,{state:row});
  };
  const submitLead = (row) => {
    setModalShowLead(false);
    relatedLeadList();
  };

  //   const labels = {
  //     beforeSelect: " "
  //   }

  const deleteLead = async () => {
    const result = await inventoryApi.deleteLead(reletedLead.id);
    if (result.success) {
      setReletedLead("");
      setModalShow(false);
      relatedLeadList();
    }
  };

  //   const editPatientTests = (row) => {
  //     setModalShowPatientTests(true)
  //     setReletedProperty(row.row);
  //   }

  const header = [
    {
      title: "Name",
      prop: "name",
      isFilterable: true,
      cell: (row) => (
        <div>

          <Link to={"/leads/" + row.id} state={row} className="name" >
            {`${row.firstname} ${row.lastname}`}
          </Link>


        </div>
      ),
    },
    // { title: "Last Name", prop: "lastname" }, // cell: (row) => (moment(row.tdate).format('DD-MM-YYYY')) },
    { title: "Phone", prop: "phone" },
    { title: "Email", prop: "email" },
    { title: "Status", prop: "status" },
    { title: "Source", prop: "leadsource" },
    {
      title: "Address", prop: "address",
      cell: (row) => (
        <span>
          <div className="address">{`${row.street}, ${row.city}, ${row.pincode}, ${row.state}`}</div>
        </span>
      ),
    },
    // { title: "City", prop: "city" },
    // { title: "State", prop: "state" },
    // { title: "Country", prop: "country" }, // cell: (row) => (row.totalamount - row.discount) },

    {
      title: "Actions",
      prop: "id",
      cell: (row) => (
        <>
          <Button className="btn-sm mx-2" onClick={() => editLead( row )}>
            <i className="fa-regular fa-pen-to-square"></i>
          </Button>
          <Button
            className="btn-sm mx-2"
            variant="danger"
            onClick={() => handleDelete(row)}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      {modalShow && (
        <Confirm
          show={modalShow}
          onHide={() => setModalShow(false)}
          deleteLead={deleteLead}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="lead"
        />
      )}

      {/* {modalShowProperty &&
           
          <PropertyEditOnClick
          show={modalShowProperty}
          onHide={() => setModalShowProperty(false)}
          parent={parent}
          reletedProperty={reletedProperty}
          submitProperty={submitProperty}
        /> 
          } */}

      {body ? (
        <DatatableWrapper
          body={body}
          headers={header}
          paginationOptionsProps={{
            initialState: {
              rowsPerPage: 5,
            },
          }}
        >
          <Row className="mb-4">
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-start"
            ></Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-start"
            ></Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            ></Col>
          </Row>
          <Table striped className="related-list-table" responsive="sm">
            <TableHeader />
            <TableBody />
          </Table>
          <Pagination />
        </DatatableWrapper>
      ) : (
        ""
      )}
    </>
  );
};

export default RelatedLead;



