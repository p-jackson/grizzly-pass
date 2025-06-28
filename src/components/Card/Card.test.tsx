import { shallow } from "enzyme";
import moment from "moment";
import type { Project, Status, LabelInfo } from "../../types";
import { CardPresentation } from "../Card";
import DatePicker from "../DatePicker";
import Label from "../Label";
import ProgressBar from "../ProgressBar";
import Selectable from "../Selectable";
import "redux-thunk";

function renderCard({
  title = "",
  person = "",
  time = moment().toISOString(),
  progress = 0,
  status = "ontrack",
  labels = [],
  readonly = true,
  handleProjectChange = vi.fn(),
}: {
  title?: string;
  person?: string;
  time?: string;
  progress?: number;
  status?: Status;
  labels?: LabelInfo[];
  readonly?: boolean;
  handleProjectChange?: (project: Project) => void;
} = {}) {
  return shallow(
    <CardPresentation
      project={{
        id: "id113",
        title,
        person,
        time,
        progress,
        status,
        labels: labels.map(({ id }) => id),
      }}
      labelInfo={labels}
      readonly={readonly}
      updateProject={handleProjectChange}
    />,
  );
}

it("renders the title as selectable text", () => {
  const card = renderCard({ title: "The Title" });
  expect(card.find(".Card-title").find(Selectable).prop("children")).toBe(
    "The Title",
  );
});

it("renders the title as <input> text when not readonly", () => {
  const card = renderCard({ title: "The Title", readonly: false });
  expect(card.find(".Card-title").find("input").prop("value")).toBe(
    "The Title",
  );
});

it("adds a placeholder to the title <input>", () => {
  const card = renderCard({ title: "", readonly: false });
  expect(card.find(".Card-title").find("input").prop("placeholder")).toBe(
    "Title",
  );
});

it("renders the person as selectable text", () => {
  const card = renderCard({ person: "Joe Lemon" });
  expect(card.find(".Card-person").find(Selectable).prop("children")).toBe(
    "Joe Lemon",
  );
});

it("renders the person as <input> text when not readonly", () => {
  const card = renderCard({ person: "Joe Lemon", readonly: false });
  expect(card.find(".Card-person").find("input").prop("value")).toBe(
    "Joe Lemon",
  );
});

it("adds a placeholder to the person <input>", () => {
  const card = renderCard({ person: "", readonly: false });
  expect(card.find(".Card-person").find("input").prop("placeholder")).toBe(
    "Person",
  );
});

it("renders the date as selectable text", () => {
  const card = renderCard({ time: "2017-03-15T10:47:10.562Z" });
  expect(card.find(".Card-date").find(Selectable).prop("children")).toBe(
    "15 March",
  );
});

it("renders the date as a <DatePicker /> when not readonly", () => {
  const card = renderCard({
    time: "2017-03-15T10:47:10.562Z",
    readonly: false,
  });
  expect(card.find(".Card-date").find(DatePicker).props()).toMatchObject({
    time: "2017-03-15T10:47:10.562Z",
    readonly: false,
  });
});

it("passes the progress and status props to the <ProgressBar>", () => {
  const card = renderCard({ progress: 30, status: "ontrack" });
  expect(card.find(ProgressBar).props()).toEqual({
    progress: 30,
    status: "ontrack",
  });
});

it("has no labels by default", () => {
  const card = renderCard();
  expect(card.find(".Card-labels").length).toBe(0);
  expect(card.find(Label).length).toBe(0);
});

it("renders a <Label /> for each labels prop", () => {
  const labels = [
    { id: "1", initial: "A", colour: "#f00", title: "Apple" },
    { id: "2", initial: "B", colour: "#0f0", title: "Brick" },
  ];
  const card = renderCard({ labels });
  expect(card.find(Label).length).toBe(2);
});

it("passes label props down to <Label />", () => {
  const labels = [{ id: "1", initial: "A", colour: "#f00", title: "Apple" }];
  const card = renderCard({ labels });
  expect(card.find(Label).props()).toMatchObject({
    labelInfo: {
      id: "1",
      initial: "A",
      colour: "#f00",
      title: "Apple",
    },
  });
});

it("calls onProjectChange when the title field is changed", () => {
  const handleProjectChange = vi.fn();
  renderCard({ handleProjectChange, readonly: false })
    .find(".Card-title input")
    .simulate("change", { target: { value: "New Text" } });
  expect(handleProjectChange).toHaveBeenCalled();
  expect(handleProjectChange.mock.calls[0][0]).toMatchObject({
    title: "New Text",
  });
});

it("calls onProjectChange when the person field is changed", () => {
  const handleProjectChange = vi.fn();
  renderCard({ handleProjectChange, readonly: false })
    .find(".Card-person input")
    .simulate("change", { target: { value: "New Text" } });
  expect(handleProjectChange).toHaveBeenCalled();
  expect(handleProjectChange.mock.calls[0][0]).toMatchObject({
    person: "New Text",
  });
});

it("calls onProjectChange when the date field is changed", () => {
  const handleProjectChange = vi.fn();
  const onTimeChange = renderCard({ handleProjectChange, readonly: false })
    .find(DatePicker)
    .prop("onTimeChange");
  const now = moment().format();
  onTimeChange(now);
  expect(handleProjectChange).toHaveBeenCalled();
  expect(handleProjectChange.mock.calls[0][0]).toMatchObject({
    time: now,
  });
});
