import React, { useState, useEffect,  forwardRef, useImperativeHandle, useRef  } from 'react'
import { Badge, Button, Col, Row, Table } from 'react-bootstrap';
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
import inventoryApi from "../../api/inventoryApi";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';


const TaskHistoryList = ({parent, refreshTaskList}) => {


  const [modalShow, setModalShow] = React.useState(false);
  const [task, setTask] = React.useState('');
  const [modalShowTask, setModalShowTask] = React.useState(false);
  const [modalShowTaskView, setModalShowTaskView] = React.useState(false);
  
  // Create table headers consisting of 4 columns.
  
  const [body, setBody] = useState([]);

  useEffect(() => {
    taskList();
    
  }, [refreshTaskList]);
  
  const taskList = () => {
    async function init() {
      let tasks = await inventoryApi.fetchTaskHistory(parent.id);
      ////.log(tasks);
      if (tasks && tasks?.length > 0) {
        setBody(tasks);
      } else {
        setBody([]);
      }
    }
    init();
  }
  const handleDelete = (row) => {
    setModalShow(true);
    setTask(row);
  }

  const labels = {
    beforeSelect: " "
  }

  const deleteTask = async () => {
    const result = await inventoryApi.deleteTask(task.id);
    if (result.success) {
      setTask('');
      setModalShow(false);
      taskList();
    }
  }

  const submitTasks = () => {
    setModalShowTask(false);
    taskList();
  }

  const editTask = (row) => {
    setModalShowTask(true)
    setTask(row);
  }

  const viewTask = (row) => {
    setModalShowTaskView(true)
    setTask(row);
  }

//   taskid, name, description, field, oldvalue, newvalue, createdbyid, createddate

  const header = [
    {title: 'Name', prop: 'name',},
    { title: 'Description', prop: 'description',  cell: (row) => ( row.type !== 'Email' ? <div class="task-list-description">{row.description}</div>: "") },
    // { title: 'Field', prop: 'field' },
    // { title: 'Old Value', prop: 'oldvalue' },
    // { title: 'New Value', prop: 'newvalue' },
    // { title: 'Created By', prop: 'createdbyid' },
    { title: 'Edited Date', prop: 'createddate', cell: (row) => (moment(row.createddate).format('DD-MM-YYYY')) },
  ];


  return (
    <>
      {body ?
        <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
          initialState: {
            rowsPerPage: 5
          }
        }}>
          <Row className="">
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
            <TableBody />
          </Table>
          <Pagination />
        </DatatableWrapper> : ''}
    </>
  )
};

export default TaskHistoryList;