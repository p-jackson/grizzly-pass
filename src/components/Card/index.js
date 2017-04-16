// @flow

import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { updateProject } from "../../actions";
import type { State } from "../../reducer";
import { getEditable, getProject, getLabelInfo } from "../../reducer";
import type { Project, LabelInfo } from "../../types";
import DatePicker from "../DatePicker";
import Label from "../Label";
import ProgressBar from "../ProgressBar";
import Selectable from "../Selectable";
import "./Card.css";

type CardProps = {
  readonly: boolean,
  project: Project,
  labelInfo: LabelInfo[],
  updateProject: Project => void
};

export function CardPresentation({
  readonly,
  project,
  labelInfo,
  updateProject
}: CardProps) {
  const { progress, status } = project;

  const labelsDiv = !labelInfo.length
    ? null
    : <div className="Card-labels">
        {labelInfo.map(labelInfo => (
          <div key={labelInfo.id} className="Card-label">
            <Label labelInfo={labelInfo} readonly={readonly} />
          </div>
        ))}
      </div>;

  const className = ["Card", readonly && "isReadonly"].filter(f => f).join(" ");

  return (
    <div className={className}>
      <div className="Card-title">
        {renderTextElement(project, "title", readonly, updateProject)}
      </div>
      <div className="Card-person">
        {renderTextElement(project, "person", readonly, updateProject)}
      </div>
      <div className="Card-date">
        {renderDate(project, "time", readonly, updateProject)}
      </div>
      {labelsDiv}
      <div className="Card-progress">
        <ProgressBar progress={progress} status={status} />
      </div>
    </div>
  );
}

function renderTextElement(
  wholeProject: Project,
  attr: "title" | "person",
  readonly: boolean,
  onChange: Project => void
) {
  const text = wholeProject[attr];

  if (readonly) return <Selectable>{text}</Selectable>;
  else
    return (
      <input
        value={text}
        placeholder={attr === "title" ? "Title" : "Person"}
        onChange={e => onChange({ ...wholeProject, [attr]: e.target.value })}
      />
    );
}

function renderDate(
  wholeProject: Project,
  attr: "time",
  readonly: boolean,
  onChange: Project => void
) {
  const time = wholeProject[attr];
  const date = moment(time).format("D MMMM");

  if (readonly) return <Selectable>{date}</Selectable>;
  else
    return (
      <DatePicker
        readonly={readonly}
        time={time}
        onTimeChange={time => onChange({ ...wholeProject, time })}
      />
    );
}

function mapStateToProps(state: State, { projectId }) {
  const project = getProject(state, projectId);
  if (project == null) return {};

  return {
    readonly: !getEditable(state),
    project,
    labelInfo: project.labels.map(id => getLabelInfo(state, id))
  };
}

const mapDispatchToProps = {
  updateProject
};

const Card = connect(mapStateToProps, mapDispatchToProps)(CardPresentation);

export default Card;
