import React, { useRef } from "react";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";
// import email from "../email.js";
import { Button } from "primereact/button";
import ReportSheet from "../Reports.js";
import { ipcRenderer } from "electron";
import { Toast } from "primereact/toast";

function Report() {
  const toast = useRef(null);
  function sendEmail() {
    ipcRenderer.send("node:email");
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Email sent",
      life: 3000,
    });
  }

  return (
    <>
      <div id="emp-landing" className="section section__container">
        <HeaderTile tileTitle="Report" tileName="" before="/rosterB" next="/" />
        <h1>Report</h1>
        <Toast ref={toast} />
        <div className="exp">
          <ReportSheet />
        </div>

        <div className="confirmEmail">
          <h3>Confirm and send Email</h3>
          <Button
            type="button"
            label="Send Email"
            icon="pi pi-users"
            className="p-button-warning"
            badge=""
            badgeClassName="p-badge-info"
            onClick={sendEmail}
          />
        </div>
      </div>
    </>
  );
}

export default Report;
