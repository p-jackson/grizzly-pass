import { PropTypes } from "react";

export const statusIds = ["ontrack", "atrisk", "intervention", "onhold"];

export const tabIds = ["edit"];

export const projectShape = {
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(statusIds).isRequired,
  label: PropTypes.arrayOf(PropTypes.string)
};

export const labelInfoShape = {
  id: PropTypes.string.isRequired,
  initial: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
