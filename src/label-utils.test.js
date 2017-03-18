import { maxLabels, generateLabelInfo } from "./label-utils";

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

  it("chooses unique initials when labels start with the same character", () => {
    expect(
      generateLabelInfo([
        { id: "1", title: "Apple" },
        { id: "2", title: "Ant" }
      ])
    ).toEqual({
      "1": { id: "1", initial: "AP", colour: "#EF5350" },
      "2": { id: "2", initial: "AN", colour: "#7E57C2" }
    });
  });
});
