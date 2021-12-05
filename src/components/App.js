import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { ipcRenderer } from "electron";
import Branding from "../components/Morecules/Branding.js";
import SitePlace from "../Components/Morecules/SiteBox.js";
import "../App.css";
import "primereact/resources/themes/mdc-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { PanelMenu } from "primereact/panelmenu";

const items = [
  {
    label: "Employee",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "Employee(Brisbane)",
        command: () => {
          window.location.hash = "/regemp";
        },
      },
      {
        label: "Employee(Sydney)",
        command: () => {
          window.location.hash = "/regemp";
        },
      },
    ],
  },
  {
    label: "Customer",
    icon: "pi pi-fw pi-pencil",
    items: [
      {
        label: "Customer(Brisbane)",
        command: () => {
          window.location.hash = "/customer";
        },
      },
      {
        label: "Customer(Sydney)",
      },
    ],
  },
];

const App = () => {
  return (
    <>
      <div id="landing" className="section section__container">
        <Branding />
        <div className="landing-divider">
          <div className="divider__left">
            <PanelMenu
              model={items}
              style={{ width: "12rem", paddingTop: "1rem" }}
            />
          </div>
          <div className="divider__right">
            <h1>Welcome to Iffice Roster</h1>
            {/* <img className="App-logo" src={logo} alt="" /> */}
            <div className="Site-place">
              <Link to="/roster">
                <SitePlace name="BRISBANE" />
              </Link>
              <Link to="logger">
                <SitePlace name="SYDNEY" />
              </Link>
            </div>
            <div className="landing-bottom"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
