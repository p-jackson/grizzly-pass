import React, { PropTypes } from "react";
import { statusIds } from "../types";
import "./ProgressBar.css";

export default function ProgressBar({ progress, status }) {
  const className = ["ProgressBar", `isStatus-${status}`].join(" ");

  return (
    <div className={className}>
      <div className="ProgressBar-text">{statusText(status)}</div>
      <div className="ProgressBar-inner" style={{ width: `${progress}%` }} />
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(statusIds).isRequired
};

function statusText(statusId) {
  switch (statusId) {
    case "ontrack":
      return "On Track";
    case "atrisk":
      return "At Risk";
    case "intervention":
      return "Intervention Required";
    case "onhold":
      return "On Hold";
    default:
      throw new Error(`Invalid status prop: ${statusId}`);
  }
}
