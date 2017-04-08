// @flow

import React from "react";
import moment from "moment";
import DatePicker from "../DatePicker";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";
import type { ProjectWithLabelInfo } from "../../types";
import "./Card.css";

type CardProps = {
  readonly?: boolean,
  project: ProjectWithLabelInfo,
  onProjectChange: (ProjectWithLabelInfo) => void
};

export default function Card(
  {
    readonly = true,
    project,
    onProjectChange
  }: CardProps
) {
  const { progress, status, labels } = project;

  const labelsDiv = !labels.length
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
      <div className="Card-date">
        {renderDate(project, "time", readonly, onProjectChange)}
      </div>
      {labelsDiv}
      <div className="Card-progress">
        <ProgressBar progress={progress} status={status} />
      </div>
    </div>
  );
}

function renderTextElement(
  wholeProject: ProjectWithLabelInfo,
  attr: "title" | "person",
  readonly: boolean,
  onChange: (ProjectWithLabelInfo) => void
) {
  const text = wholeProject[attr];

  if (readonly) return <Selectable>{text}</Selectable>;
  else return (
      <input
        value={text}
        placeholder={attr === "title" ? "Title" : "Person"}
        onChange={e => onChange({ ...wholeProject, [attr]: e.target.value })}
      />
    );
}

function renderDate(
  wholeProject: ProjectWithLabelInfo,
  attr: "time",
  readonly: boolean,
  onChange: (ProjectWithLabelInfo) => void
) {
  const time = wholeProject[attr];
  const date = moment(time).format("D MMMM");

  if (readonly) return <Selectable>{date}</Selectable>;
  else return (
      <DatePicker
        readonly={readonly}
        time={time}
        onTimeChange={time => onChange({ ...wholeProject, time })}
      />
    );
}
