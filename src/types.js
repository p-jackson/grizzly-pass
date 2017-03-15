import { PropTypes } from "react";

export const statusIds = ["ontrack", "atrisk", "intervention", "onhold"];

export const ProjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(statusIds)
});
