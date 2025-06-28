let uniqueCounter = 0;
export function uniqueId() {
  return `${++uniqueCounter}`;
}
