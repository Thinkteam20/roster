import React, { createRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeline from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import adaptivePlugin from "@fullcalendar/adaptive";
import interaction from "@fullcalendar/interaction";
import "../styles/Scheduler.css";
import getEvents from "../Data/Event.js";

function Scheduler() {
  const calenderRef = createRef();

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

  return (
    <FullCalendar
      height="650px"
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      weekNumberCalculation="ISO"
      timeZone="UTC"
      ref={calenderRef}
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        resourceTimelinePlugin,
        adaptivePlugin,
        resourceTimeGridPlugin,
      ]}
      initialView="resourceTimeline"
      resourceGroupField="site"
      resources={resourcesCol}
      customButtons={{
        iffice: {
          text: "Iffice",
          views: {
            week: {
              type: "agenda",
              duration: { days: 7 },
              groupByResource: true,
            },
          },
          click() {
            const calender = calenderRef.current;
            if (calender) {
              const calenderApi = calender.getApi();
              calenderApi.changeView("resourceTimeline");
            }
          },
        },
      }}
      editable="true"
      events={getEvents}
      headerToolbar={{
        left: "prev next",
        center: "title",
        right: "timeGridWeek,resourceTimeGridDay,iffice",
      }}
    />
  );
}

export default Scheduler;
