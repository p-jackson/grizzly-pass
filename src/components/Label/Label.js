import React, { PropTypes } from "react";
import "./Label.css";

export default function Label({ initial, colour }) {
  return <div className="Label" style={{ background: colour }}>{initial}</div>;
}

Label.propTypes = {
  initial: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired
};
