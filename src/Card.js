import React, { PropTypes } from "react";
import moment from "moment";
import Selectable from "./Selectable";
import ProgressBar from "./ProgressBar";
import { statusIds } from "./types";
import "./Card.css";

export default function Card({ title, person, time, progress, status }) {
  const date = moment(time).format("D MMMM");

  return (
    <div className="Card">
      <div className="Card-title"><Selectable>{title}</Selectable></div>
      <div className="Card-person"><Selectable>{person}</Selectable></div>
      <div className="Card-date"><Selectable>{date}</Selectable></div>
      <div className="Card-progress">
        <ProgressBar progress={progress} status={status} />
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(statusIds).isRequired
};
