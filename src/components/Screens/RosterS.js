import React from "react";
import SchedulerS from "../SchedulerS.js";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";

function RosterS() {
  return (
    <>
      <div id="roster" className="section se">
        <HeaderTile tileTitle="Roster" tileName="" />
        <h1>Roster(Sydney)</h1>
        <div className="roster">
          <div className="scheduler">
            <SchedulerS />
          </div>
        </div>
      </div>
    </>
  );
}

export default RosterS;
