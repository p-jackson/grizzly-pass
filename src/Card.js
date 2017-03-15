import React, { PropTypes } from "react";
import Selectable from "./Selectable";
import ProgressBar from "./ProgressBar";
import { statusIds } from "./types";
import "./Card.css";

export default function Card({ title, person, progress, status }) {
  return (
    <div className="Card">
      <div className="Card-title"><Selectable>{title}</Selectable></div>
      <div className="Card-person"><Selectable>{person}</Selectable></div>
      <ProgressBar progress={progress} status={status} />
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(statusIds).isRequired
};
