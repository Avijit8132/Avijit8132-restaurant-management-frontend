import React, { useState, useEffect,  forwardRef, useImperativeHandle, useRef  } from 'react'
import { Badge, Button, Col, Row, Table,Tooltip,OverlayTrigger } from 'react-bootstrap';
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
import Confirm from '../common/Confirm';
import TaskEdit from './TaskEdit';
import TaskView from './TaskView';

const RelatedListTask = ({parent, refreshTaskList}) => {


  const [modalShow, setModalShow] = React.useState(false);
  const [task, setTask] = React.useState('');
  const [modalShowTask, setModalShowTask] = React.useState(false);
  const [modalShowTaskView, setModalShowTaskView] = React.useState(false);
  const [tooltipEditVisibility, setTooltipEditVisibility] = useState({});
  const [tooltipDeleteVisibility, setTooltipDeleteVisibility] = useState({});
  // Create table headers consisting of 4 columns.
  
  const [body, setBody] = useState([]);
  

  /*useEffect(() => {
    ////.log(parent.id);
    taskList();
    
  }, []);*/

  useEffect(() => {
    taskList();
    
  }, [refreshTaskList]);
  
  const taskList = () => {
    async function init() {
      let tasks = await inventoryApi.fetchTasks(parent.id);
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

  

  const header = [
    {
      title: 'Title', prop: 'title',
      

      cell: (row) => (
        <>
         <Link
            onClick={() => viewTask( {row} )}
            state={parent}
          >
            {row.title}
          </Link>
         
        </>
       
      )
    },
    { title: 'Task Type', prop: 'type', cell: (row) => ( row.type ? row.type: "") },
    // { title: 'Description', prop: 'description', cell: (row) => ( row.description? parse(row.description): "") },

    { title: 'Description', prop: 'description',  cell: (row) => ( row.type !== 'Email' ? <div class="task-list-description">{row.description}</div>: "") },


    { title: 'Status', prop: 'status' },
    { title: 'Target Date', prop: 'targetdate', cell: (row) => (moment(row.targetdate).format('DD-MM-YYYY')) },
    { title: 'Created Date', prop: 'createddate', cell: (row) => (moment(row.createddate).format('DD-MM-YYYY')) },
    { title: 'Created By', prop: 'createdbyname' },
    {
      title: 'Actions',
      prop: 'id',
      cell: (row) => (
        <>
          {row.type !== 'Email' ? (
              <Button
                 title='Edit'
                className="btn-sm mx-2"
                onClick={() => editTask({ row })}
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </Button>
          ) : (
            ''
          )}
            <Button
              title='Delete'
              className="btn-sm mx-2"
              variant="danger"
              onClick={() => handleDelete(row)}
             
            >
              <i class="fa-regular fa-trash-can"></i>
            </Button>
        </>
      ),
    },
  ];


  return (
    <>
      {modalShow &&
      <Confirm
        show={modalShow}
        onHide={() => setModalShow(false)}
        deleteTask={deleteTask}
        title="Confirm delete?"
        message="You are going to delete the record. Are you sure?"
        table="task"
      />}
      {modalShowTask &&
        <TaskEdit
          show={modalShowTask}
          onHide={() => setModalShowTask(false)}
          parentid={parent.id}
          task={task}
          table="lead"
          submitTasks={submitTasks}
        />
        }

{modalShowTaskView &&
        <TaskView
          show={modalShowTaskView}
          onHide={() => setModalShowTaskView(false)}
          parentid={parent.id}
          task={task}
          table="lead"
          submitTasks={submitTasks}
        />
        }

      {body ?



        <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
          initialState: {
            rowsPerPage: 5
          }
        }}>
          <Row className="mb-4">
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
            <TableBody rowKey="id" />
          </Table>
          <Pagination />
        </DatatableWrapper> : ''}
    </>
  )
};

export default RelatedListTask