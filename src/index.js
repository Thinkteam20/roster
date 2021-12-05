import React from "react";
import { render } from "react-dom";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import App from "./components/App";
import "./App.css";
import RegEmp from "./components/Sidebar/Employee/RegEmp.js";
import Report from "./components/Screens/Report.js";
import Roster from "./components/Screens/Roster.js";
import RegCus from "./components/Sidebar/Customers/RegCus.js";
import Logger from "./components/Screens/Logger.js";

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement("div");

root.id = "root";
document.body.appendChild(root);

// Now we can render our application into it
render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/regemp" element={<RegEmp />} />
      <Route path="/rep" element={<Report />} />
      <Route path="/roster" element={<Roster />} />
      <Route path="/customer" element={<RegCus />} />
      <Route path="/logger" element={<Logger />} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
