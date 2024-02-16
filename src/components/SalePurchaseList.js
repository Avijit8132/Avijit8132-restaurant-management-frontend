import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import inventoryApi from "../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import TransactionEdit from "./TransactionEdit";
import Badge from "react-bootstrap/Badge";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Link } from "react-router-dom";
import InfoPill from "./common/InfoPill";
import CustomSeparator from "./Breadcrumbs/CustomSeparator";
import NewInfoPill from "./common/NewInfoPill/NewInfoPill";

const SalePurchaseList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [transactions, setTransactions] = useState();
  const [showTransactionModel, setShowTransactionModel] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isTotalIncome, setIsTotalIncome] = useState(true);
  const [isTotalExpense, setIsTotalExpense] = useState(true);
  const [type, setType] = useState("Income");
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    async function init() {
      const result = await inventoryApi.fetchTransactions();
      //.log("result:", result);
      //if(result && result.errors && result.errors)
      if (result) {
        let incomeAmt = 0;
        let expenseAmt = 0;
        for (let data of result) {
          if (data.type === "Income") {
            incomeAmt += Number(data.amount);
            setTotalIncome(incomeAmt.toFixed(2));
          } else {
            expenseAmt += Number(data.amount);
            setTotalExpense(expenseAmt.toFixed(2));
          }
        }
        setBody(result);
        setTransactions(result);
      } else {
        setBody([]);
        setTransactions([]);
      }
    }
    init();
  };

  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(transactions);
      setIsTotalExpense(true)
      setIsTotalIncome(true)

    } else {
      setBody(
        transactions.filter((data) => {
          if (
            (data.type || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
        })
      );
      if(event.target.value === 'Income'){
        setIsTotalIncome(true)
        setIsTotalExpense(false)
      }else{
        setIsTotalIncome(false)
        setIsTotalExpense(true)
      }
    }
    ////.log('isTotalIncome', isTotalIncome,isTotalExpense)
  };

  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "Summary",
      prop: "title",
      isFilterable: true,
      cell: (row) => (
        <Link onClick={() => editTransaction(row.type, row)}>{row.title}</Link>
      ),
    },
    {
      title: "Type",
      prop: "type",
      isFilterable: true,
      cell: (row) => {
        return (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "15px",
              paddingBottom: "5px",
              color: "black",
              fontWeight: 'bold',
              fontSize: '0.9rem',
              background: row.type === 'Income' ? '#85d884' : '#EF9F9F' ,
            }}
          >
            {row.type}
          </span>
        );
      },
    },
    { title: "Category", prop: "category", isFilterable: true },
    { title: "Amount", prop: "amount", isFilterable: true },
    {
      title: "Transaction Date",
      prop: "transactiondate",
      cell: (row) => moment(row.transactiondate).format("DD-MM-YYYY"),
      isFilterable: true,
    },
    { title: "Payment Status", prop: "paymentstatus", isFilterable: true },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createTransaction = (tType) => {
    setType(tType);
    setTransaction(null);
    setShowTransactionModel(true);
  };

  const editTransaction = (tType, data) => {
    setType(tType);
    setTransaction(data);
    setShowTransactionModel(true);
  };

  const submitTransaction = (eventRec) => {
    setShowTransactionModel(false);
    fetchTransactions();
  };

  return (
    <Container>
    <Row className="g-0 mx-2">
      {showTransactionModel && (
        <TransactionEdit
          show={showTransactionModel}
          onHide={() => setShowTransactionModel(false)}
          transaction={transaction}
          table="user"
          type={type}
          submitEvents={submitTransaction}
        />
      )}

        <CustomSeparator 
      // cmpListName="Report List" 
      currentCmpName="Income / Expense"
      indexLength="0"
      url="/transactions" > 
      </CustomSeparator>
      <Col lg={2} className="px-4">
        
      </Col>
      <Col
        xs={12}
        sm={12}
        lg={10}
        className="d-flex flex-col justify-content-end align-items-end"
      >
        <Button
          className="btn-sm mx-2"
          variant="success"
          onClick={() => createTransaction("Income")}
        >
          Add Income
        </Button>
        <Button
          className="btn-sm"
          variant="danger"
          onClick={() => createTransaction("Expense")}
        >
          Add Expense
        </Button>
      </Col>

      <Col lg={12} className="px-4">
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
            sortProps={{
              initialState : {
              prop: "createddate",
              order: "desc"
            } }}
          >
            <Row className="mb-4">
              <Col
                 xs={6}
                 sm={6}
                 lg={2}
                 className="mt-2">
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
                 className="mt-2">                
                 <Form.Group  controlId="formBasicStatus">
                  <Form.Select
                    aria-label="Enter status"
                    name="type"
                    onChange={onFilterType}
                  >
                    <option value="">--All--</option>
                    <option value="Income">Income </option>
                    <option value="Expense">Expense</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={6}
                className="d-flex flex-col justify-content-start align-items-start mt-2"
              >
                { isTotalIncome && <div style={{ marginTop: "1px", textDecoration: "none" }}>
                  <NewInfoPill
                    left="Total Income"
                    right={
                      <CurrencyFormat
                        displayType={"text"}
                        value={totalIncome}
                        thousandSeparator={true}
                        prefix={"₹ "}
                      ></CurrencyFormat>
                    }
                  />
                </div>}

                { isTotalExpense && <div style={{ marginTop: "1px", textDecoration: "none",  marginLeft:"5px"}}>
                  <NewInfoPill
                    left="Total Expense"
                    right={
                      <CurrencyFormat
                        displayType={"text"}
                        value={totalExpense}
                        thousandSeparator={true}
                        prefix={"₹ "}
                      ></CurrencyFormat>
                    }
                  />
                </div>}
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

export default SalePurchaseList;
