import React, { PropTypes } from "react";
import moment from "moment";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";
import { statusIds } from "../../types";
import "./Card.css";

export default function Card(
  {
    title,
    person,
    time,
    progress,
    status,
    labels,
    readonly = true,
    onTitleChange,
    onPersonChange
  }
) {
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
      <div className="Card-title">
        {renderTextElement(title, readonly, onTitleChange)}
      </div>
      <div className="Card-person">
        {renderTextElement(person, readonly, onPersonChange)}
      </div>
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
  readonly: PropTypes.bool,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      initial: PropTypes.string.isRequired,
      colour: PropTypes.string.isRequired
    })
  ),
  onTitleChange: PropTypes.func.isRequired,
  onPersonChange: PropTypes.func.isRequired
};

function renderTextElement(text, readonly, onChange) {
  if (readonly) return <Selectable>{text}</Selectable>;
  else return <input value={text} onChange={e => onChange(e.target.value)} />;
}
