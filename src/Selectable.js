import React, { PropTypes } from "react";

export default function Selectable({ children }) {
  return <span className="enableSelection">{children}</span>;
}

Selectable.propTypes = {
  children: PropTypes.string.isRequired
};
