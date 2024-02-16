// import React, {useState, useEffect} from 'react'
// import FullCalendar from '@fullcalendar/react' // must go before plugins
// import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
// import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
// import timeGridPlugin from '@fullcalendar/timegrid'
// import { Container } from 'react-bootstrap'
// import EventEdit from './EventEdit'

// const Calendar = () => {
//     const [events, setEvents] = useState([]);
//     const [showEventModel, setShowEventModel] = useState(false);
//     const calendarRef = React.createRef();
//     const [event, setEvent] = useState({})

//     const handleDateClick = (selectInfo) => { // bind with an arrow function
//         //.log('selectInfo:', selectInfo);
//         //createEvent(selectInfo);
//         setEvent({});
//         setShowEventModel(true);
//         //.log('showEventModel:', showEventModel);
//       }
    
//     const createEvent = (selectInfo) => {
//         let title = prompt('Please enter a new title for your event')
//       let calendarApi = selectInfo.view.calendar
  
//       calendarApi.unselect() // clear date selection
  
//       if (title) {
//         const event = {
//             id: Math.floor(Math.random() * 1000),
//             title,
//             start: new Date(), //selectInfo.startStr,
//             end: selectInfo.endStr,
//             allDay: selectInfo.allDay
//           };

//         calendarApi.addEvent(event);
//         //.log('events:', events);
//       }
//     }
      
//       const handleEventClick = (arg) => { // bind with an arrow function
//         //.log(arg.event);
//         setEvent({title: arg.event.title, description: arg.event.extendedProps.description});
//         setShowEventModel(true);
//       }

//       const submitEvents = (eventRec) => {
//         let calendarApi = calendarRef.current.getApi();
  
//          calendarApi.unselect() // clear date selection
         
//          calendarApi.addEvent(eventRec);
//          setShowEventModel(false);
//       }

//       const handleEventAdded = (data) => {
//         //setEvents(meetings);
       
//         //.log('data:', data.event);
//       }

//       const handleEvents = (meetings) => {
//             //.log('meetings:', meetings);
//       }
//       useEffect( () => {
//     //     async function init(){
//     //      const products = await inventoryApi.fetchProduct();
//     //      if(products)
         
//     //        setBody(products);
//     //    }
//     //    init();
//         let meetings =[
//             { title: 'Meeting with Agarwal', start: '2023-03-01', end: '2023-03-01', description : 'Need to discuss about the upcoming villa project.'},
//             { title: 'Papers submit for villa', start: '2023-03-06', description : 'Flat 558 papers are due to submit at nigam.'},
//             { title: 'Appointment with Dr.', start: '2023-03-06', description : 'Meeting with Dr. Sahil Dentist.'},
//             { title: 'School Parent Meeting', start: '2023-03-07T12:00:00', end: '2023-03-07T18:00:00', description : 'Sunny school parent meeting at 12 PM.'},
//             { title: 'Investor Summit', start: '2023-03-14T12:00:00', end: '2023-03-15T18:00:00', description : '2 days long summit where I need to meet couple of important prospoects.' },
//             { title: 'Agent meetup flats', start: '2023-03-25', description : 'Monthly  meeting with all my agents related to discussion about new project.' },
//           ];
        
//         setEvents(meetings);
 
//    }, []);


//    const renderEventContent = (eventInfo) => {
//     return (
//       <>
//         <div style={{backgroundColor: "red"}}>
        
//         <b>{eventInfo.event.title}</b>
//         <p>{eventInfo.timeText}</p>
//         </div>
//       </>
//     )
//   }


//   return (
//     <Container>
        
//         {showEventModel && 

//     <EventEdit
//           show={showEventModel}
//           onHide={() => setShowEventModel(false)}
//           parentid="abc"
//           eventRec={event}
//           table="user"
//           submitEvents={submitEvents}
//         />
//         }
//     <FullCalendar
//         plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
//         initialView="dayGridMonth"
//         events = {events}
//         dateClick={handleDateClick}
//         eventClick={handleEventClick}
//         headerToolbar={{
//             left: 'prev,next today',
//             center: 'title',
//             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//           }}
//           eventsSet={handleEvents}
//         eventAdd={handleEventAdded}
//         ref={calendarRef}
//         eventBackgroundColor="#0d6efd"
//         eventBorderColor="#0d6efd"
//         eventDisplay='block'
//       />
//       </Container>
//   )
// }

// export default Calendar



import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from '@fullcalendar/timegrid';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import EventEdit from './EventEdit';
import inventoryApi from '../../api/inventoryApi';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { isMobile } from 'react-device-detect';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";
import CustomSeparator from "../Breadcrumbs/CustomSeparator";



const Calendar = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [showEventModel, setShowEventModel] = useState(false);
  const calendarRef = useRef(null);
  const [event, setEvent] = useState({});

  const handleDateClick = (selectInfo) => {
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0)

    let selectedDate = new Date(selectInfo.date);
    selectedDate.setHours(0,0,0,0)

    console.log("currentDate", currentDate);
    console.log("selectedDate", selectedDate);

    if (moment(selectedDate).isBefore(currentDate)) {
      toast.error("Cannot create events for past dates", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
      return;
    }

    console.log("selectInfo", selectInfo);
    let curTime = selectInfo.date;
    curTime.setHours(new Date().getHours());
    curTime.setMinutes(new Date().getMinutes());
    setEvent({
      startdatetime: curTime,
      targetdate: curTime,
      enddatetime: selectInfo.date,
    });
    setShowEventModel(true);
  };
  
  
  

  const createEvent = (selectInfo) => {
    let title = prompt('Please enter a new title for your event');
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const event = {
        id: Math.floor(Math.random() * 1000),
        title,
        start: new Date(), //selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };

      calendarApi.addEvent(event);
    }
  };

  const handleEventClick = (arg) => {
    //.log('arg', arg.event.extendedProps);
    ////.log('arg', arg.event.date, arg.event.title, arg.event.end);
    setEvent({
      title: arg.event.title,
      description: arg.event.extendedProps.description,
      id: arg.event.id,
      type: arg.event.extendedProps.type,
      priority: arg.event.extendedProps.priority,
      status: arg.event.extendedProps.status,
      startdatetime: moment(arg.event.start).format('MM/DD/YYYY'),
      targetdate: moment(arg.event.start).format('MM/DD/YYYY'),
      enddatetime: arg.event.end ?moment(arg.event.end).format('MM/DD/YYYY')  : moment(arg.event.start).format('MM/DD/YYYY'),
      ownerid: arg.event.extendedProps.ownerid,
      ownername: arg.event.extendedProps.ownername
    });
    setShowEventModel(true);
  };

  const submitEvents = (eventRec) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.unselect(); // clear date selection
    //.log('eventRec', eventRec);
    //.log(calendarApi.getEventById(eventRec.id))
    if( calendarApi.getEventById(eventRec.id))
    calendarApi.getEventById(eventRec.id).remove();
    calendarApi.addEvent(eventRec);
    ////.log('success');
    setShowEventModel(false);
    taskList();
  };

  const deleteEvents = (eventRec) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.unselect(); // clear date selection
   
      calendarApi.getEventById(eventRec.id).remove()
    //calendarApi.deleteEvents(eventRec);
    ////.log('success');
    setShowEventModel(false);
  };

  const customEventContent = (eventInfo) => {
    return (
      <Row>
      <Col lg={12}><span style={{padding : '0.25em'}}>{eventInfo.event.title}</span></Col>
      <Col lg={12}><span style={{display: 'inline-block', fontSize: ".8rem", padding: "0.25rem", borderRadius: "5px", marginBottom : ".5rem", color: "white", /* backgroundColor : "#84d8d1" */}}  >{eventInfo.event.extendedProps.ownername}</span>
      </Col>
      </Row>
    ) 
  };

  useEffect(() => {
    if(isMobile){
      calendarRef.current.getApi().changeView('timeGridWeek');
    }else{

   
    if (
      location.pathname.split("/").length > 2
    ) {
      
      calendarRef.current.getApi().changeView('timeGridDay');
    }
  }
    
    taskList();
  }, []);

  const taskList = () => {
    async function init() {
      let tasks = await inventoryApi.fetchTasksWithoutParent();
      ////.log(JSON.stringify(tasks));
      ////.log('tasks', tasks);

      let taskFilter = tasks?.filter((value, index, array) => (value.startdatetime != null || value.targetdate != null));
      ////.log('taskFilter', taskFilter);

      let arrayOfTask = taskFilter?.map((value, index, array) => {
        return {
          id: value.id,
          title: value.title,
          start: value.startdatetime || value.targetdate ,
          end: value.enddatetime || value.targetdate,
          description: value.description,
          type: value.type,
          priority: value.priority,
          status: value.status,
          ownerid: value.ownerid,
          ownername: value.ownername,
          color : value.priority === "High" ? "#EF9F9F" : (value.priority === "Normal" ? "" : "#1a293b")
        };
      });

      setEvents(arrayOfTask);
      //.log('arrayOfTask', arrayOfTask);
    }
    init();
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <div style={{ backgroundColor: "red" }}>
          <b>{eventInfo.event.title}</b>
          <p>{eventInfo.timeText}</p>
        </div>
      </>
    );
  };

  return (
    <Container className='pt-4'>
    
    <CustomSeparator
        currentCmpName="Meetings"
        indexLength="0"
        url="/meetings"
      ></CustomSeparator>
      <Row></Row>

      {showEventModel && (
        <EventEdit
          show={showEventModel}
          onHide={() => setShowEventModel(false)}
          parentid="abc"
          eventRec={event}
          table="user"
          submitEvents={submitEvents}
          deleteEvents={deleteEvents}
        />
      )}
     <div title=" Click Here to Create a Meeting" className='mt-4'>
  <FullCalendar
    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, momentTimezonePlugin]}
    initialView="dayGridMonth"
    events={events}
    timeZone='Asia/Kolkata'
    headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }}
    eventBackgroundColor="#a5e9e3"
    eventBorderColor="#a5e9e3"
    eventDisplay='block'
    dateClick={handleDateClick}
    eventClick={handleEventClick}
    eventContent={customEventContent}
    height={"auto"}
    // eventsSet={taskList}
    ref={calendarRef}
  />
</div>

           <ToastContainer />
    </Container>
  );
};

export default Calendar;
