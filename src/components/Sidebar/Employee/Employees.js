import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../../../styles/App.css";

const employees = [
  {
    id: 1,
    name: "employees1",
    role: "Vacuum",
    location: "QLD",
    site: "LV",
    workDate: ["mon", "tue"],
  },
  {
    id: 2,
    name: "employees2",
    role: "Dusting",
    location: "QLD",
    site: "LV",
    workDate: ["sat", "sun"],
  },
  {
    id: 3,
    name: "employees3",
    role: "Mop",
    location: "QLD",
    site: "LV",
    workDate: ["sat", "sun"],
  },
];
function Employees() {
  return (
    <div id="landing" className="section section__container">
      {employees.map((emp) => emp.name)}
      <div>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}

export default Employees;
