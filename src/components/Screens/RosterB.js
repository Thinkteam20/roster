import React from "react";
import SchedulerB from "../SchedulerB.js";
import "../../App.css";
import HeaderTile from "../Morecules/HeaderTile.js";

function RosterB() {
  return (
    <>
      <div id="roster" className="section se">
        <HeaderTile tileTitle="Roster" tileName="" before="/" next="/rep" />

        <h1>Roster(Brisbane)</h1>

        <div className="roster">
          <div className="scheduler">
            <SchedulerB />
          </div>
        </div>
      </div>
    </>
  );
}

export default RosterB;
