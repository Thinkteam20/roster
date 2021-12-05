import React from "react";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";
// import email from "../email.js";
import { Button } from "primereact/button";
import ReportSheet from "../Reports.js";

function Report() {
  return (
    <>
      <div id="landing" className="section section__container">
        <HeaderTile tileTitle="Report" tileName="" />
        <h1>Report</h1>
        <div>hi</div>
        <div className="exp">
          <ReportSheet />
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Report;
