import React from "react";
import "../../styles/SiteBox.css";

function SitePlace(props) {
  return (
    <div>
      <div className="site-div">
        <span>{props.name}</span>
      </div>
    </div>
  );
}

export default SitePlace;
