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

  const testingdata = [
    {
      id: "",
      title: "Versace",
      start: "2021-12-09T12:30:00Z",
      end: "2021-12-09T14:30:00Z",
    },
  ];

  let events = [];
  console.log(event);

  // const resource = emp[0];

  // console.log(resource);

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
        initialView="resourceTimelineWeek"
        resourceGroupField="site"
        resources={event}
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
        events={event}
        headerToolbar={{
          left: "prev next",
          center: "title",
          right: "custom,timeGridWeek,resourceTimelineDay",
        }}
      />
    </>
  );
}

export default Scheduler;
