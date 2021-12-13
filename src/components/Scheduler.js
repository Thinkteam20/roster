import React, { createRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import timeGridWeek from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeline from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelineDay from "@fullcalendar/resource-timeline";
import resourceTimelineMonth from "@fullcalendar/resource-timeline";
import resourceTimelineWeek from "@fullcalendar/resource-timeline";
import adaptivePlugin from "@fullcalendar/adaptive";
import interaction from "@fullcalendar/interaction";
import "../styles/Scheduler.css";
import getEvents from "../Data/Event.js";
import { ipcRenderer } from "electron";

function Scheduler() {
  const calenderRef = createRef();
  const [event, setEvent] = useState([]);

  useEffect(() => {
    ipcRenderer.send("cusb:load");
    ipcRenderer.on("cusb:get", (e, logs) => {
      console.log("get data from Mongo db");
      // console.log(logs);
      // setProducts(logs);
      setEvent(JSON.parse(logs));
    });
  }, []);

  const resourcesCol = [
    {
      title: "Versace",
      id: "1",
      site: "Versace",
      roles: "Auditorium A",
      location: "123CBD",
    },
    {
      title: "Bvlgari",
      id: "2",
      site: "LV",
      roles: "Auditorium G",
      location: "123CBD",
    },
    {
      title: "Chanel",
      id: "3",
      site: "LV",
      roles: "Auditorium H",
      location: "123CBD",
    },
    {
      title: "Chanel",
      site: "Gucci",
      id: "4",
      roles: "Auditorium O",
      location: "123CBD",
    },
    {
      title: "Longchamp",
      id: "5",
      site: "Gucci",
      roles: "Auditorium P",
      location: "123CBD",
    },
  ];

  // const resource = emp[0];

  let allevent = event.map((eventy) => {
    return eventy.event;
  });

  function eventee(rowEvent) {
    console.log(rowEvent.length);
    for (let element of rowEvent) {
      // return element;
    }
  }

  // eventee(allevent);

  console.log(eventee(allevent));
  // eventee(allevent);

  return (
    <>
      <FullCalendar
        height="650px"
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        weekNumberCalculation="ISO"
        timeZone="UTC"
        ref={calenderRef}
        slotMinTime="07:00:00"
        slotMaxTime="17:00:00"
        plugins={[
          resourceTimeGridPlugin,
          resourceTimelineDay,
          resourceTimelineWeek,
          resourceTimelineMonth,
          timeGridPlugin,
          timeGridWeek,
        ]}
        // slotDuration={(days = 1)}
        initialView="resourceTimelineDay"
        resourceGroupField="site"
        resources={resourcesCol}
        customButtons={{
          custom: {
            text: "Iffice",
            views: {
              week: {
                type: "agenda",
                duration: { days: 1 },
                groupByResource: true,
              },
            },
            click() {
              const calender = calenderRef.current;
              if (calender) {
                const calenderApi = calender.getApi();
                calenderApi.changeView("resourceTimelineWeek");
              }
            },
          },
        }}
        editable="true"
        events={eventee(allevent)}
        headerToolbar={{
          left: "prev next",
          center: "title",
          right: "resourceTimelineDay",
        }}
      />
    </>
  );
}

export default Scheduler;
// custom,timeGridWeek,
