import { uniqueId } from "@/unique-id";
import type { Status } from "../../types";
import { useRef } from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  progress: number;
  status: Status;
}

export default function ProgressBar({ progress, status }: ProgressBarProps) {
  const className = ["ProgressBar", `isStatus-${status}`].join(" ");
  const labelId = useRef(uniqueId()).current;

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-labelledby={labelId}
    >
      <div id={labelId} className="ProgressBar-text">
        {statusText(progress, status)}
      </div>
      <div
        className="ProgressBar-inner"
        data-testid="ProgressBar-inner"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function statusText(progress: number, status: Status): string {
  if (progress >= 100) return "Done";

  switch (status) {
    case "ontrack":
      return "On Track";
    case "atrisk":
      return "At Risk";
    case "intervention":
      return "Intervention Required";
    case "onhold":
      return "On Hold";
    default:
      throw new Error(`Invalid status prop: ${status}`);
  }
}
