import * as React from "react";
import * as moment from "moment";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";
import { Status, statusIds } from "../../types";
import "./Card.css";

interface CardProps {
  title: string;
  person: string;
  time: string;
  progress: number;
  status: Status;
  labels?: {
    id: string;
    initial: string;
    colour: string;
  }[];
}

export default function Card(props: CardProps) {
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
