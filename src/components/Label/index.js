import React, { PropTypes } from "react";
import { labelInfoShape } from "../../types";
import "./Label.css";

export default function Label({ labelInfo }) {
  const { initial, colour } = labelInfo;
  return <div className="Label" style={{ background: colour }}>{initial}</div>;
}

Label.propTypes = {
  labelInfo: PropTypes.shape(labelInfoShape).isRequired
};
