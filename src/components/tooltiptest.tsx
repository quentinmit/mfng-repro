// Needed to compile properly, even though this file doesn't use any React client features:
//"use client";

import React from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export function TooltipTest() {
  const tooltip = (
    <Tooltip id="start-again-tooltip">
      This is a tooltip
    </Tooltip>
  );
  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <div>Hover me</div>
    </OverlayTrigger>
  );
}