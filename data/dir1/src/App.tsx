"use client";

import React from "react";

import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export function App() {
  const tooltip = (
    <Tooltip id="start-again-tooltip">
      Start again
    </Tooltip>
  );

  return (
    <div className="app-vertical">
      <div id="app-bottom">
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <button></button>
        </OverlayTrigger>
      </div>
    </div>
  );
}
