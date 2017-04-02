import React, { PropTypes } from "react";
import Label from "../Label";
import { labelInfoShape } from "../../types";
import "./Legend.css";

export default function Legend({ projects, labels }) {
  const allProjectLabels = removeDuplicateLabels(
    projects.reduce((memo, { labels = [] }) => memo.concat(labels), [])
  );

  const labelElems = allProjectLabels.map(labelInfo => {
    return (
      <div className="Legend-labelWrapper" key={labelInfo.id}>
        <Label labelInfo={labelInfo} />
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

Legend.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.shape(labelInfoShape))
    })
  ).isRequired
};

function removeDuplicateLabels(labels) {
  const foundLabels = [];
  return labels.filter(label => {
    if (foundLabels.indexOf(label.id) === -1) {
      foundLabels.push(label.id);
      return true;
    }
    return false;
  });
}
