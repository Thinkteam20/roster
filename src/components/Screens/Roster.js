import React from "react";
import Scheduler from "../Scheduler.js";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";

function Roster() {
  return (
    <>
      <div id="roster" className="section se">
        <HeaderTile tileTitle="Roster" tileName="" />
        <h1>Roster</h1>
        <div className="roster">
          <div className="scheduler">
            <Scheduler />
          </div>
        </div>
      </div>
    </>
  );
}

export default Roster;
