import React, { PropTypes } from "react";
import Selectable from "./Selectable";
import "./Card.css";

export default function Card({ title, person }) {
  return (
    <div className="Card">
      <div className="Card-title"><Selectable>{title}</Selectable></div>
      <div className="Card-person"><Selectable>{person}</Selectable></div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired
};
