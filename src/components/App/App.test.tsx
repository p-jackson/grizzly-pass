// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import reducer from "../../reducer";
import { loadDemoData } from "../../actions";
import type { Project, TabId } from "../../types";
import { AppPresentation, mapStateToProps } from "../App";
import { createStore } from "redux";
import { Provider } from "react-redux";

const projectsByMonth: { month: string; projectIds: string[] }[] = [
  {
    month: "March",
    projectIds: ["1"],
  },
  {
    month: "April",
    projectIds: ["2"],
  },
];

function renderApp({
  title,
  projectsByMonth = [],
  importFile = vi.fn(),
  errorMessage,
  selectedTab,
  selectTab = vi.fn(),
  updateProject = vi.fn(),
}: {
  title?: string;
  projectsByMonth?: { month: string; projectIds: string[] }[];
  importFile?: (file: File) => void;
  errorMessage?: string | string[];
  selectedTab?: TabId;
  selectTab?: (tabId?: TabId) => void;
  updateProject?: (project: Project) => void;
} = {}) {
  const store = createStore(reducer);
  store.dispatch(loadDemoData());

  render(
    <Provider store={store}>
      <AppPresentation
        projectsByMonth={projectsByMonth}
        title={title}
        importFile={importFile}
        selectTab={selectTab}
        errorMessage={errorMessage}
        selectedTab={selectedTab}
        updateProject={updateProject}
      />
    </Provider>,
  );
}

it("shows a header", () => {
  renderApp();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Demo Dashboard",
  );
});

it("renders month names at the top of the columns", () => {
  renderApp({ projectsByMonth });
  const columnHeadings = screen.getAllByRole("heading", { level: 2 });
  expect(columnHeadings[0]).toHaveTextContent("March");
  expect(columnHeadings[1]).toHaveTextContent("April");
});

it("calls drop handler when browser support the DataTransferItemList interface", () => {
  const mockFile = { MOCK: "FILE" };
  const importFile = vi.fn();
  renderApp({ importFile });
  fireEvent.drop(screen.getByTestId("dropzone"), {
    preventDefault: () => {},
    dataTransfer: {
      items: [{ kind: "file", getAsFile: () => mockFile }],
    },
  });
  expect(importFile).toHaveBeenCalledWith(mockFile);
});

it("calls drop handler when browser support the DataTransfer interface", () => {
  const mockFile = { MOCK: "FILE" };
  const importFile = vi.fn();
  renderApp({ importFile });
  fireEvent.drop(screen.getByTestId("dropzone"), {
    preventDefault: () => {},
    dataTransfer: {
      files: [mockFile],
    },
  });
  expect(importFile).toHaveBeenCalledWith(mockFile);
});

it("doesn't call drop handler it wasn't a file that was dropped", async () => {
  const importFile = vi.fn();
  renderApp({ importFile });
  fireEvent.drop(screen.getByTestId("dropzone"), {
    preventDefault: () => {},
    dataTransfer: {
      items: [{ kind: "string", getAsFile: () => {} }],
    },
  });
  expect(importFile).not.toHaveBeenCalled();
});

it("displays errorMessage if it's passed as a prop", () => {
  renderApp({ errorMessage: "Error Name" });
  expect(screen.getByText("Error Name")).toBeInTheDocument();
});

it("displays errors as a list if errorMessage prop is an array", () => {
  const errorMessage = ["Error 1", "Error 2"];
  renderApp({ errorMessage });
  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent("Error 1");
  expect(items[1]).toHaveTextContent("Error 2");
});

it("can map default state to props", () => {
  const state = reducer(undefined as any, { type: "DUMMY_ACTION" });
  expect(mapStateToProps(state, { readFileAsText: vi.fn() })).toMatchSnapshot();
});
