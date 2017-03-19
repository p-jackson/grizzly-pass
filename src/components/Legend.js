import React, { PropTypes } from "react";
import Label from "./Label";
import "./Legend.css";

export default function Legend({ projects, labels }) {
  const allProjectLabels = removeDuplicateLabels(
    projects.reduce((memo, { labels = [] }) => memo.concat(labels), [])
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

Legend.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      labels: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          initial: PropTypes.string.isRequired,
          colour: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })
      )
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
