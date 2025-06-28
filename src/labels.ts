import type { Label, LabelInfo } from "./types";

const colours = [
  "#EF5350",
  "#7E57C2",
  "#78909C",
  "#EC407A",
  "#5C6BC0",
  "#8D6E63",
  "#AB47BC",
];

export function maxLabels() {
  return colours.length;
}

export function generateLabelInfo(labels: Label[]): Record<string, LabelInfo> {
  return labels.reduce(
    (memo, label, i) =>
      Object.assign(memo, {
        [label.id]: {
          id: label.id,
          initial: (sharesFirstLetter(labels, label)
            ? label.title.substr(0, 2)
            : label.title.substr(0, 1)
          ).toUpperCase(),
          colour: colours[i],
          title: label.title,
        },
      }),
    {},
  );
}

function sharesFirstLetter(labels: Label[], label: Label) {
  const ch = label.title.substr(0, 1);
  return labels.some((l) => l !== label && l.title.startsWith(ch));
}
