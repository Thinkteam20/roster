import React, { createRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import adaptivePlugin from "@fullcalendar/adaptive";
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
      ref={calenderRef}
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        resourceTimelinePlugin,
        adaptivePlugin,
        resourceTimeGridPlugin,
      ]}
      initialView="resourceTimeGridDay"
      resourceGroupField="site"
      resources={resourcesCol}
      customButtons={{
        myTimeLineDayBtn: {
          text: "Day",
          click() {
            const calender = calenderRef.current;

            if (calender) {
              const calenderApi = calender.getApi();
              calenderApi.changeView("resourceTimelineDay");
            }
          },
        },
      }}
      timeZone="UTC"
      events={getEvents}
      headerToolbar={{
        left: "prev next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,myTimeLineDayBtn,resourceTimeGridDay",
      }}
    />
  );
}

export default Scheduler;
