import React, { useRef, useState, useEffect } from "react";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";
// import email from "../email.js";
import { Button } from "primereact/button";
import ReportSheet from "../Reports2.js";
import { ipcRenderer } from "electron";
import { Toast } from "primereact/toast";

function ReportS() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ipcRenderer.send("events2:load");
    ipcRenderer.on("events2:get", (e, logs) => {
      console.log("get data from events S", logs);
      setProducts(JSON.parse(logs));
    });
  }, []);

  const emails = products.map(function (data) {
    return data.email;
  });

  const toast = useRef(null);
  async function sendEmail() {
    try {
      ipcRenderer.send("node:email2", emails);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Email sent",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div id="emp-landing" className="section section__container">
        <HeaderTile
          tileTitle="Report"
          tileName="Sydney"
          before="/rosterS"
          next="/"
        />
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

export default ReportS;
