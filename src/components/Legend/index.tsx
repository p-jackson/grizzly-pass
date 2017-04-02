import * as React from "react";
import Label from "../Label";
import "./Legend.css";

interface Label {
  id: string;
  initial: string;
  colour: string;
  title: string;
}

interface LegendProps {
  projects: {
    labels?: Label[];
  }[];
}

export default function Legend({ projects }: LegendProps) {
  const allProjectLabels = removeDuplicateLabels(
    projects.reduce((memo, { labels = [] }) => memo.concat(labels), [] as Label[])
  );

  const labelElems = allProjectLabels.map(label => {
    const { id, colour, initial, title } = label;
    return (
      <div className="Legend-labelWrapper" key={id}>
        <Label colour={colour} initial={initial} />
        <div className="Legend-labelTitle">{title}</div>
      </div>
    );
  });

  return (
    <div className="Legend">
      <div className="Legend-title">Legend:</div>
      <div className="Legend-labels">
        {labelElems}
      </div>
    </div>
  );
}

function removeDuplicateLabels(labels: Label[]) {
  const foundLabels = [] as string[];
  return labels.filter(label => {
    if (foundLabels.indexOf(label.id) === -1) {
      foundLabels.push(label.id);
      return true;
    }
    return false;
  });
}
