// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { formatISO, parse } from "date-fns";
import type { Project, Status, LabelInfo } from "../../types";
import { CardPresentation } from "../Card";
import { useState } from "react";
import "redux-thunk";

function renderCard({
  title = "",
  person = "",
  time = formatISO(new Date()),
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
  function Wrapper() {
    const [project, setProject] = useState<Project>({
      id: "id113",
      title,
      person,
      time,
      progress,
      status,
      labels: labels.map(({ id }) => id),
    });

    return (
      <CardPresentation
        project={project}
        labelInfo={labels}
        readonly={readonly}
        updateProject={(p) => {
          setProject(p);
          handleProjectChange(p);
        }}
      />
    );
  }

  return render(<Wrapper />);
}

it("renders the title as selectable text", () => {
  renderCard({ title: "The Title" });
  expect(screen.getByText("The Title")).toHaveClass("enableSelection");
});

it("renders the title as <input> text when not readonly", () => {
  renderCard({ title: "The Title", readonly: false });
  expect(screen.getByPlaceholderText("Title")).toHaveValue("The Title");
});

it("renders the person as selectable text", () => {
  renderCard({ person: "Joe Lemon" });
  expect(screen.getByText("Joe Lemon")).toHaveClass("enableSelection");
});

it("renders the person as <input> text when not readonly", () => {
  renderCard({ person: "Joe Lemon", readonly: false });
  expect(screen.getByPlaceholderText("Person")).toHaveValue("Joe Lemon");
});

it("renders the date as selectable text", () => {
  renderCard({ time: "2017-03-15T10:47:10.562Z" });
  expect(screen.getByText("15 March")).toHaveClass("enableSelection");
});

it("renders the date as a <DatePicker /> when not readonly", () => {
  renderCard({
    time: "2017-03-15T10:47:10.562Z",
    readonly: false,
  });
  expect(screen.getByRole("button", { name: "15 March" })).toBeInTheDocument();
});

it("passes the progress and status props to the <ProgressBar>", () => {
  renderCard({ progress: 30, status: "ontrack" });
  expect(screen.getByRole("progressbar", { name: "On Track" })).toHaveValue(30);
});

it("renders a <Label /> for each labels prop", () => {
  const labels = [
    { id: "1", initial: "A", colour: "#f00", title: "Apple" },
    { id: "2", initial: "B", colour: "#0f0", title: "Brick" },
  ];
  renderCard({ labels });

  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();
});

it("passes label props down to <Label />", () => {
  const labels = [{ id: "1", initial: "A", colour: "#f00", title: "Apple" }];
  renderCard({ labels });

  const label = screen.getByText("A");
  expect(label).toHaveStyle({ background: "#f00" });
  expect(label).toHaveAttribute("title", "Apple");
});

it("calls onProjectChange when the title field is changed", async () => {
  const user = userEvent.setup();
  const handleProjectChange = vi.fn();
  renderCard({ handleProjectChange, readonly: false });

  await user.type(screen.getByPlaceholderText("Title"), "New Title");

  expect(handleProjectChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      title: "New Title",
    }),
  );
});

it("calls onProjectChange when the person field is changed", async () => {
  const user = userEvent.setup();
  const handleProjectChange = vi.fn();
  renderCard({ handleProjectChange, readonly: false });

  await user.type(screen.getByPlaceholderText("Person"), "New Name");

  expect(handleProjectChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      person: "New Name",
    }),
  );
});

it("calls onProjectChange when the date field is changed", async () => {
  const user = userEvent.setup();
  const handleProjectChange = vi.fn();

  renderCard({ handleProjectChange, readonly: false });
  await user.click(screen.getByRole("button"));

  // If today is the 8th, we click the 18th
  // If today is the 18th, we click the 8th
  // Otherwise we click the first match (which will be the 8th)
  const dateElement = screen
    .getAllByText(/8/, { selector: "button" })
    .filter((button) => button.parentElement?.ariaSelected !== "true")[0];
  await user.click(dateElement);

  expect(handleProjectChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      time: formatISO(
        parse(
          dateElement.parentElement?.dataset.day ?? "",
          "yyyy-MM-dd",
          new Date(),
        ),
      ),
    }),
  );
});
