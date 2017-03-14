import React, { PropTypes } from "react";
import "./Card.css";

export default function Card({ title, person }) {
  return (
    <div className="Card">
      <div className="Card-title">{title}</div>
      <div className="Card-person">{person}</div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired
};
