import * as React from "react";
import { Status } from "../../types";
import "./ProgressBar.css";

interface ProgressBarProps {
  progress: number;
  status: Status;
};

export default function ProgressBar({ progress, status }: ProgressBarProps) {
  const className = ["ProgressBar", `isStatus-${status}`].join(" ");

  return (
    <div className={className}>
      <div className="ProgressBar-text">{statusText(progress, status)}</div>
      <div className="ProgressBar-inner" style={{ width: `${progress}%` }} />
    </div>
  );
}

function statusText(progress: number, statusId: Status) {
  if (progress >= 100) return "Done";

  switch (statusId) {
    case "ontrack":
      return "On Track";
    case "atrisk":
      return "At Risk";
    case "intervention":
      return "Intervention Required";
    case "onhold":
      return "On Hold";
  }
}
