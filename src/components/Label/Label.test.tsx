import { shallow } from "enzyme";
import { Button } from "react-aria-menubutton";
import Label from "../Label";

function renderLabel({
  initial = "",
  title = "",
  colour = "",
  readonly = true,
}: {
  initial?: string;
  title?: string;
  colour?: string;
  readonly?: boolean;
} = {}) {
  const labelInfo = { id: "1", initial, colour, title };
  return shallow(<Label labelInfo={labelInfo} readonly={readonly} />);
}

it("renders the label's initial", () => {
  const label = renderLabel({ initial: "A" });
  expect(label.text()).toBe("A");
});

it("renders the label's initial (when not read-only)", () => {
  const label = renderLabel({ initial: "A", readonly: false });
  expect(label.find(Button).prop("children")).toBe("A");
});

it("applies the colour prop as a background style", () => {
  const label = renderLabel({ colour: "#f00" });
  expect(label.prop("style")).toMatchObject({
    background: "#f00",
  });
});

it("applies the colour prop as a background style (when not read-only)", () => {
  const label = renderLabel({ colour: "#f00", readonly: false });
  expect(label.find(Button).prop("style")).toMatchObject({
    background: "#f00",
  });
});

it("has a tooltip with the label's title", () => {
  const label = renderLabel({ title: "Apple" });
  expect(label.first().prop("title")).toBe("Apple");
});

it("has a tooltip with the label's title (when not read-only)", () => {
  const label = renderLabel({ title: "Apple", readonly: false });
  expect(label.find(Button).prop("title")).toBe("Apple");
});
