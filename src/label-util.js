const colours = [
  "#EF5350",
  "#7E57C2",
  "#78909C",
  "#EC407A",
  "#5C6BC0",
  "#8D6E63",
  "#AB47BC"
];

export function maxLabels() {
  return colours.length;
}

export function generateLabelInfo(labels) {
  return labels.reduce(
    (memo, label, i) => Object.assign(memo, {
      [label.id]: {
        id: label.id,
        initial: label.title.substr(0, 1),
        colour: colours[i]
      }
    }),
    {}
  );
}
