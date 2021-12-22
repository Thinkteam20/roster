import React, { createRef, useEffect, useState, useRef } from "react";
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

function SchedulerS() {
  const calenderRef = createRef();
  const [event, setEvent] = useState([]);
  const [events, setEvents] = useState([]);
  const [column, setColumn] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [eventDialog, setEventDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataEmp, setDataEmp] = useState();
  const toast = useRef(null);
  const [workemp, setWorkEmp] = useState(null);
  const [empOption, setEmpOption] = useState();
  const [eventCal, setEventCal] = useState([]);

  const emptyEvents = {
    weekday: "",
    resourceId: "",
    title: "",
    start: "",
    end: "",
    backgroundColor: "",
    recronizedId: "",
  };

  useEffect(() => {
    ipcRenderer.send("cusc:load");
    ipcRenderer.on("cusc:get", (e, logs) => {
      console.log("get data from Mongo db");
      // console.log(logs);
      // setProducts(logs);
      setColumn(JSON.parse(logs));
    });
    // get emp Brisbane current list
    ipcRenderer.send("logs2:load");
    ipcRenderer.on("logs2:get", (e, logs) => {
      console.log("get data from empS");
      setDataEmp(JSON.parse(logs));
    });
    // get events Brisbane current list
    ipcRenderer.send("events2:load");
    ipcRenderer.on("events2:get", (e, logs) => {
      console.log("get data from events S", logs);
      setEventCal(JSON.parse(logs));
    });
  }, [workemp, events]);

  const recronizedId = () => {
    let GroupId = "";
    let chars = "0123456789";
    for (let i = 0; i < 5; i++) {
      GroupId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return GroupId;
  };
  const setWeekday = (data) => {
    let time = data;
    // console.log(time);
    var options = {
      weekday: "long",
      // year: "numeric",
      // month: "long",
      // day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      //hour12: false,
    };

    let dayofweek = new Date(time).toLocaleTimeString("en-us", options);
    return dayofweek;
  };

  const saveEvent = () => {
    setSubmitted(true);
    if (event.title.trim()) {
      let _events = [...events];
      let _event = { ...event };
      // let _deleteTarget = event.recronizedId;
      // if (event.id) {
      //   const index = findIndexById(product.id);
      //   _products[index] = _product;
      //   console.log(_deleteTarget);
      //   // ipcRenderer.send("cusb:update", _deleteTarget, _product);
      //   setEvents(_products);
      //   toast.current.show({
      //     severity: "success",
      //     summary: "Successful",
      //     detail: "Updated",
      //     life: 3000,
      //   });
      // } else {
      _event.recronizedId = recronizedId();
      _event.weekday = setWeekday(_event.start);
      console.log(_event.weekday);
      console.log(_event);
      _events.push(_event);
      ipcRenderer.send("events2:add", _events);
      setEvents(_events);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Product Created",
        life: 3000,
      });
      // }
      setEvents(_events);
      setEventDialog(false);
      setEvent(emptyEvents);
    }
  };
  const listEmpData = () => {
    const _data = dataEmp.map(({ name }) => ({ name }));
    return _data;
  };

  const holdSelectedEmp = (e) => {
    setWorkEmp(e.value);
    // console.log(e.target.value);
    // let _event = { ...event };
    // _product["site"] = e.value["name"];
    // let merged = Object.assign(_event, workemp);
    // console.log(merged);
    // setProduct(_product);
    // console.log(e.value);
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

  const onEmpChange = (e) => {
    console.log(e.value);
    setWorkEmp(e.value);
    // let _event = { ...event };
    // _product["site"] = e.value["name"];
    // setProduct(_product);
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
        {dataEmp && (
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
              {submitted && !event.resourceId && (
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

            {/* <div className="p-field">
              <label htmlFor="category5">Start Time</label>
              <input type="datetime-local" onChange={onTimeStartChange} />
            </div>

            <div className="p-field">
              <label htmlFor="category5">End Time</label>
              <input type="datetime-local" onChange={onTimeEndChange} />
            </div> */}

            <div className="p-field p-col">
              <label htmlFor="availableEmp">Available Empoyees</label>

              {/* <div>
                {dataEmp.map((item) => (
                  <button
                    value={workemp}
                    key={item.id}
                    onClick={holdSelectedEmp}
                  >
                    {item.name}
                  </button>
                ))}
              </div> */}
            </div>
            <div className="p-field p-col">
              <label htmlFor="quantity">-</label>

              <Dropdown
                value={workemp}
                options={dataEmp}
                onChange={function (e) {
                  console.log(e.target.value);
                  setWorkEmp(e.target.value);
                  let _initialValue = e.target.value;
                  let _event = { ...event };
                  const _merged = Object.assign(_event, e.target.value);
                  console.log(_merged);
                  setEvent(_merged);
                }}
                optionLabel="name"
                placeholder="Select Employee"
              />
            </div>
          </Dialog>
        )}
      </div>
      <div className="fixed-button">
        <Button
          label="Add Events"
          className="p-button-danger"
          onClick={openNewEvent}
        />
      </div>
      <Toast ref={toast} />
      <FullCalendar
        height="650px"
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        weekNumberCalculation="ISO"
        timeZone="UTC"
        ref={calenderRef}
        slotMinTime="05:00:00"
        slotMaxTime="17:00:00"
        eventClick={function (info) {
          let eventObj = info.event.title;
          alert("event has been deleted");
          // alert(eventObj.title);
          ipcRenderer.send("event2:delete", eventObj);
          setEvents([...events]);
          info.jsEvent.preventDefault();
        }}
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
        // slotDuration={"24:00:00"}
        allDayMaintainDuration={false}
        resourceGroupField="site"
        // slotDuration={"24:00:00"}
        // slotMinTime={"00:00:00"}
        // slotMaxTime={"00:00:00"}
        nowIndicator={false}
        resources={column}
        customButtons={{
          custom: {
            text: "shop&week",
            views: {
              week: {
                type: "timeline",
                allDaySlot: "true",
                buttonText: "Custom Week",
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
        events={eventCal}
        headerToolbar={{
          left: "prev next",
          center: "title",
          right: "timeGridWeek,custom",
        }}
      />
    </>
  );
}

export default SchedulerS;
// custom,timeGridWeek,
