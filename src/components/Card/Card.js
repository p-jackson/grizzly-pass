import React, { PropTypes } from "react";
import moment from "moment";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";
import { statusIds } from "../../types";
import "./Card.css";

export default function Card(props) {
  const { title, person, time, progress, status, labels } = props;
  const date = moment(time).format("D MMMM");

  const labelsDiv = !labels
    ? null
    : <div className="Card-labels">
        {labels.map(({ id, initial, colour }) => (
          <div key={id} className="Card-label">
            <Label initial={initial} colour={colour} />
          </div>
        ))}
      </div>;

  return (
    <div className="Card">
      <div className="Card-title"><Selectable>{title}</Selectable></div>
      <div className="Card-person"><Selectable>{person}</Selectable></div>
      <div className="Card-date"><Selectable>{date}</Selectable></div>
      {labelsDiv}
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
  status: PropTypes.oneOf(statusIds).isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      initial: PropTypes.string.isRequired,
      colour: PropTypes.string.isRequired
    })
  )
};
