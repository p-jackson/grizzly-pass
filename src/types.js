// @flow

import { PropTypes } from "react";

export const statusIds = ["ontrack", "atrisk", "intervention", "onhold"];
export type Status = "ontrack" | "atrisk" | "intervention" | "onhold";

export const tabIds = ["edit"];
export type TabId = "edit";

export type Label = {
  id: string,
  title: string
};

export const labelInfoShape = {
  id: PropTypes.string.isRequired,
  initial: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
export type LabelInfo = {
  id: string,
  initial: string,
  colour: string,
  title: string
};

export const projectShape = {
  title: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(statusIds).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired
};
export type Project = {
  id: string,
  title: string,
  person: string,
  time: string,
  progress: number,
  status: Status,
  labels: string[]
};

export type ProjectWithLabelInfo = {
  id: string,
  title: string,
  person: string,
  time: string,
  progress: number,
  status: Status,
  labels: LabelInfo[]
};
