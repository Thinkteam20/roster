import React from "react";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";
// import email from "../email.js";
import { Button } from "primereact/button";
import ReportSheet from "../Reports2.js";

function ReportS() {
  return (
    <>
      <div id="emp-landing" className="section section__container">
        <HeaderTile tileTitle="Report" tileName="" before="/" next="/rep" />
        <h1>Report</h1>
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
          />
        </div>
      </div>
    </>
  );
}

export default ReportS;
