import React from "react";
import "../../styles/Tile.css";
import { Button } from "primereact/button";

function HeaderTile(props) {
  function addEmp(event) {
    console.log("Box testing");
  }
  return (
    <>
      <div id="tile">
        <div id="price-container">
          <h2 id="price">{props.tileTitle}</h2>
        </div>

        <div id="goal-container">
          <p>
            <img src="" alt="" />
            <span id="targetPrice">{props.tileName}</span>
          </p>
        </div>

        <div id="right-container">
          <Button
            label="Back"
            className="p-button-warning "
            onClick={() => {
              window.location.hash = "/";
            }}
          />
          <Button
            label="Next"
            className="p-button-warning"
            style={{ marginLeft: "3rem" }}
            onClick={() => {
              window.location.hash = "/rep";
            }}
          />
        </div>
      </div>
    </>
  );
}

export default HeaderTile;
