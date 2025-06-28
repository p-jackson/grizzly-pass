export type Status = "ontrack" | "atrisk" | "intervention" | "onhold";
export const statusIds: Status[] = [
  "ontrack",
  "atrisk",
  "intervention",
  "onhold",
];

export type TabId = "edit";
export const tabIds: TabId[] = ["edit"];

export interface Label {
  id: string;
  title: string;
}

export interface LabelInfo {
  id: string;
  initial: string;
  colour: string;
  title: string;
}

export interface Project {
  id: string;
  title: string;
  person: string;
  time: string;
  progress: number;
  status: Status;
  labels: string[];
}
