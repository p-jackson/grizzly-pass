import { maxLabels, generateLabelInfo } from "./label-util";

describe("maxLabels", () => {
  it("returns the maximum number of labels before we run out of colours", () => {
    expect(maxLabels()).toBeGreaterThan(0);
  });
});

describe("generateLabelInfo", () => {
  it("returns no info when given no labels", () => {
    expect(generateLabelInfo([])).toEqual({});
  });

  it("returns initial and colour info for labels", () => {
    expect(
      generateLabelInfo([
        { id: "1", title: "Lemon" },
        { id: "2", title: "Apple" }
      ])
    ).toEqual({
      "1": { id: "1", initial: "L", colour: "#EF5350" },
      "2": { id: "2", initial: "A", colour: "#7E57C2" }
    });
  });
});
