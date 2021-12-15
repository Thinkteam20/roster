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
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "../styles/Scheduler.css";
import getEvents from "../Data/Event.js";
import { ipcRenderer } from "electron";

function SchedulerB() {
  const calenderRef = createRef();
  const [event, setEvent] = useState([]);
  const [events, setEvents] = useState([]);
  const [column, setColumn] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [eventDialog, setEventDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataEmp, setDataEmp] = useState();

  const emptyEvents = {
    resourceId: "",
    title: "",
    start: "",
    end: "",
    backgroundColor: "",
    recronizedId: "",
  };

  useEffect(() => {
    ipcRenderer.send("cusb:load");
    ipcRenderer.on("cusb:get", (e, logs) => {
      console.log("get data from Cusb");
      setColumn(JSON.parse(logs));
    });
    // get emp Brisbane current list
    ipcRenderer.send("logs:load");
    ipcRenderer.on("logs:get", (e, logs) => {
      console.log("get data from empb");
      setDataEmp(JSON.parse(logs));
    });
  }, []);

  // console.log(emptyEvents.push());

  const recronizedId = () => {
    let GroupId = "";
    let chars = "0123456789";
    for (let i = 0; i < 5; i++) {
      GroupId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return GroupId;
  };

  const saveEvent = () => {
    setSubmitted(true);
    if (event.title.trim()) {
      let _events = [...events];
      let _event = { ...event };
      console.log(_event);
      let _deleteTarget = event.id;
      console.log(_deleteTarget);
      if (event.id) {
        const index = findIndexById(product.id);
        _products[index] = _product;
        console.log(_deleteTarget);
        // ipcRenderer.send("cusb:update", _deleteTarget, _product);
        setProducts(_products);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Updated",
          life: 3000,
        });
      } else {
        _product.groupId = createGroupId();
        _products.push(_product);
        // ipcRenderer.send("cusb:add", _products);
        setProducts(_products);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }
      setEvents(_events);
      setEventDialog(false);
      setEvent(emptyProduct);
    }
  };

  const openNewEvent = () => {
    setEvent(emptyEvents);
    setSubmitted(false);
    setEventDialog(true);
  };

  const onTimeStartChange = (e) => {
    let _event = { ...event };
    _event["start"] = e.target.value;
    setEvent(_event);
  };

  const onTimeEndChange = (e) => {
    let _event = { ...event };
    _event["end"] = e.target.value;
    setEvent(_event);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setEventDialog(false);
  };

  const onInputChange = (e, id) => {
    const val = (e.target && e.target.value) || "";
    let _event = { ...event };
    _event[`${id}`] = val;

    setEvent(_event);
  };

  const onTitleChange = (e, title) => {
    const val = (e.target && e.target.value) || "";
    let _event = { ...event };
    _event[`${title}`] = val;

    setEvent(_event);
  };
  const eventDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveEvent}
      />
    </React.Fragment>
  );
  return (
    <>
      <div className="EventsDialog">
        <Dialog
          visible={eventDialog}
          style={{ width: "700px", height: "450px" }}
          header="Add new Roster events"
          modal
          className="p-fluid"
          footer={eventDialogFooter}
          onHide={hideDialog}
        >
          <div className="p-field">
            <label htmlFor="resourceId">resourceId</label>
            <InputText
              id="resourceId"
              value={event.resourceId}
              onChange={(e) => onInputChange(e, "resourceId")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !event.resourceId,
              })}
            />
            {submitted && !event.id && (
              <small className="p-error">eventId is required.</small>
            )}
          </div>

          <div className="p-field">
            <label htmlFor="description">title</label>
            <InputTextarea
              id="title"
              value={event.title}
              onChange={(e) => onTitleChange(e, "title")}
              required
              rows={3}
              cols={20}
            />
          </div>

          <div className="p-field">
            <label htmlFor="category5">Start Time</label>
            <input type="datetime-local" onChange={onTimeStartChange} />
          </div>

          <div className="p-field">
            <label htmlFor="category5">End Time</label>
            <input type="datetime-local" onChange={onTimeEndChange} />
          </div>
        </Dialog>
      </div>
      <div className="fixed-button">
        <Button
          label="Add Events"
          className="p-button-danger"
          onClick={openNewEvent}
        />
      </div>
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
        resources={column}
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
        events={getEvents}
        headerToolbar={{
          left: "prev next",
          center: "title",
          right: "resourceTimelineDay",
        }}
      />
    </>
  );
}

export default SchedulerB;
// custom,timeGridWeek,
