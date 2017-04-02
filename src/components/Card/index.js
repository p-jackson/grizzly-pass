import React, { PropTypes } from "react";
import moment from "moment";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";
import { projectShape, labelInfoShape } from "../../types";
import "./Card.css";

export default function Card(
  {
    readonly = true,
    project,
    onProjectChange
  }
) {
  const { time, progress, status, labels } = project;
  const date = moment(time).format("D MMMM");

  const labelsDiv = !labels
    ? null
    : <div className="Card-labels">
        {labels.map(labelInfo => (
          <div key={labelInfo.id} className="Card-label">
            <Label labelInfo={labelInfo} />
          </div>
        ))}
      </div>;

  const className = ["Card", readonly && "isReadonly"].filter(f => f).join(" ");

  return (
    <div className={className}>
      <div className="Card-title">
        {renderTextElement(project, "title", readonly, onProjectChange)}
      </div>
      <div className="Card-person">
        {renderTextElement(project, "person", readonly, onProjectChange)}
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
  readonly: PropTypes.bool,
  project: PropTypes.shape({
    ...projectShape,
    labels: PropTypes.arrayOf(PropTypes.shape(labelInfoShape))
  }).isRequired,
  onProjectChange: PropTypes.func.isRequired
};

function renderTextElement(wholeProject, attr, readonly, onChange) {
  const text = wholeProject[attr];

  if (readonly) return <Selectable>{text}</Selectable>;
  else return (
      <input
        value={text}
        onChange={e => onChange({ ...wholeProject, [attr]: e.target.value })}
      />
    );
}
