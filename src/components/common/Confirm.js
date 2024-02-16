import React, { useState } from 'react'
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Confirm = (props) => {
  const [show, setShow] = useState(true);

  const deleteContact = () => {
    props.deleteContact();
  }
  const deleteLead = () => {
    props.deleteLead();
  }
  const deleteTask = () => {
    props.deleteTask();
  }
  const deleteFile = () => {
    props.deleteFile();
  }

  const deletePurchaseOrder = () => {
    props.deletePurchaseOrder();
  }

  const deleteOrder = () => {
    props.deleteOrder();
  }

  const deleteProject = () => {
    props.deleteProject();
  }
  
  const deleteProperty = () => {
    props.deleteProperty();
  }

  const deleteDailyTask = () => {
    //.log('props' , props)
    props.deleteDailyTask();
  }


  const deleteTodo=()=>{
    props.deleteTodo();
  }


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >

      <Alert show={show} variant="danger" className='mb-0'>
        <Alert.Heading>{props.title}</Alert.Heading>
        <p>
          {props.message}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          {props.table === "contact" &&
            <Button onClick={props.deleteContact} variant="danger" className='mx-2'>
              Yes
            </Button>
          }

          {props.table === "project" &&
            <Button onClick={props.deleteProject} variant="danger" className='mx-2'>
              Yes
            </Button>
          }
          {props.table === "property" &&
            <Button onClick={props.deleteProperty} variant="danger" className='mx-2'>
              Yes
            </Button>
          }
          {props.table === "lead" &&
            <Button onClick={props.deleteLead} variant="danger" className='mx-2'>
              Yes
            </Button>
          }
          {props.table === "task" &&
            <Button onClick={props.deleteTask} variant="danger" className='mx-2'>
             Yes
            </Button>
          }
          {props.table === "file" &&
            <Button onClick={props.deleteFile} variant="danger" className='mx-2'>
             Yes
            </Button>
          }
          {props.table === "Purchase" &&
            <Button onClick={props.deletePurchaseOrder} variant="danger" className='mx-2'>
             Yes
            </Button>
          }
          {props.table === "order" &&
            <Button onClick={props.deleteOrder} variant="danger" className='mx-2'>
             Yes
            </Button>
          }

{/* Start added by yamini  22-11-2023  */}
          {props.table === "dailyTask" &&
            <Button onClick={props.deleteDailyTask} variant="danger" className='mx-2'>
              Yes
            </Button>
          }
{/* End added by yamini  22-11-2023  */}          


          {props.table === "todo" &&
            <Button onClick={props.deleteTodo} variant="danger" className='mx-2'>
             Yes
            </Button>
          }

          <Button onClick={props.onHide} variant="light" className="text-">
            No
          </Button>
        </div>
      </Alert>
    </Modal>
  )
}

export default Confirm
