// @flow

import React from "react";
import Label from "../Label";
import type { LabelInfo } from "../../types";
import "./Legend.css";

type LegendProps = {
  projects: {
    labels: LabelInfo[]
  }[]
};

export default function Legend({ projects }: LegendProps) {
  const allProjectLabels = removeDuplicateLabels(
    projects.reduce((memo, { labels }) => memo.concat(labels), [])
  );

  const labelElems = allProjectLabels.map(labelInfo => {
    return (
      <div className="Legend-labelWrapper" key={labelInfo.id}>
        <Label labelInfo={labelInfo} readonly={true} />
        <div className="Legend-labelTitle">{labelInfo.title}</div>
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

function removeDuplicateLabels(labels: LabelInfo[]): LabelInfo[] {
  const foundLabels = [];
  return labels.filter(label => {
    if (foundLabels.indexOf(label.id) === -1) {
      foundLabels.push(label.id);
      return true;
    }
    return false;
  });
}
