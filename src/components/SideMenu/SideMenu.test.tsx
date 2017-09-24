import { shallow } from "enzyme";
import * as React from "react";
import { tabIds, TabId } from "../../types";
import { SideMenuPresentation } from "../SideMenu";

function renderSideMenu(
  {
    handleTabChange = jest.fn(),
    selectedTab
  }: { handleTabChange?: (tabId?: TabId) => void; selectedTab?: TabId } = {}
) {
  return shallow(
    <SideMenuPresentation
      selectTab={handleTabChange}
      selectedTab={selectedTab}
    />
  );
}

const defaultSideMenu = renderSideMenu();

it("contains a single button", () => {
  expect(defaultSideMenu.find("button").length).toBe(1);
});

it("has an edit button with `Edit` text", () => {
  expect(defaultSideMenu.find(`[data-testid="tabButton-edit"]`).text()).toBe(
    "Edit"
  );
});

it("selects the edit button when selectedTab is `edit`", () => {
  const handleTabChange = jest.fn();
  const sideMenu = renderSideMenu({ handleTabChange, selectedTab: "edit" });
  expect(
    sideMenu.find(`[data-testid="tabButton-edit"]`).hasClass("isSelected")
  ).toBe(true);
});

describe("onTabChange", () => {
  tabIds.forEach((tabId, i) => {
    it(`is called with "${tabId}" when button "${i}" is clicked`, () => {
      const handleTabChange = jest.fn();
      const sideMenu = renderSideMenu({ handleTabChange });
      sideMenu.find(`[data-testid="tabButton-${tabId}"]`).simulate("click");
      expect(handleTabChange).toHaveBeenCalledWith(tabId);
    });
  });

  tabIds.forEach((tabId, i) => {
    it(`is called with "undefined" when button "${i}" selected and clicked again`, () => {
      const handleTabChange = jest.fn();
      const sideMenu = renderSideMenu({ handleTabChange, selectedTab: tabId });
      sideMenu.find(`[data-testid="tabButton-${tabId}"]`).simulate("click");
      expect(handleTabChange).toHaveBeenCalledWith(undefined);
    });
  });
});
