import { shallow } from "enzyme";
import { HeaderPresentation } from "../Header";
import Logo from "../Logo";
import Selectable from "../Selectable";

const header = shallow(<HeaderPresentation title="Projects 2017" />);

it("contains a logo", () => {
  expect(header.find(Logo).length).toBe(1);
});

it("renders the document title in selectable text", () => {
  expect(header.find("h1").find(Selectable).prop("children")).toBe(
    "Projects 2017",
  );
});

it("doesn't have a header element when there's no title", () => {
  const header = shallow(<HeaderPresentation />);
  expect(header.find("h1").length).toBe(0);
});
