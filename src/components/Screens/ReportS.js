import React from "react";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";
// import email from "../email.js";
import { Button } from "primereact/button";
import ReportSheet from "../Reports.js";

function Report() {
  return (
    <>
      <div id="emp-landing" className="section section__container">
        <HeaderTile tileTitle="Report" tileName="" before="/" next="/rep" />
        <h1>Report</h1>
        <div className="exp">
          <ReportSheet />
        </div>
        <div className="confirmFlex">
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
          <div className="confirmKakao">
            <h3>Confirm and open KakaoTalk</h3>
            {/* <Button icon="pi pi-check" iconPos="right" /> */}
            <Button
              type="button"
              label="Open Kakaotalk"
              icon="pi pi-users"
              className="p-button-warning"
              badge="8"
              badgeClassName="p-badge-danger"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
