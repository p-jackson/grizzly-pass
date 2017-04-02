import * as React from "react";
import { shallow } from "enzyme";
import { tabIds } from "../../types";
import SideMenu, { SideMenuProps } from "../SideMenu";

function renderSideMenu(
  { onTabChange = jest.fn(), selectedTab }: Partial<SideMenuProps> = {}
) {
  return shallow(
    <SideMenu onTabChange={onTabChange} selectedTab={selectedTab} />
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
  const onTabChange = jest.fn();
  const sideMenu = renderSideMenu({ onTabChange, selectedTab: "edit" });
  expect(
    sideMenu.find(`[data-testid="tabButton-edit"]`).hasClass("isSelected")
  ).toBe(true);
});

describe("onTabChange", () => {
  tabIds.forEach((tabId, i) => {
    it(`is called with "${tabId}" when button "${i}" is clicked`, () => {
      const onTabChange = jest.fn();
      const sideMenu = renderSideMenu({ onTabChange });
      sideMenu.find(`[data-testid="tabButton-${tabId}"]`).simulate("click");
      expect(onTabChange).toHaveBeenCalledWith(tabId);
    });
  });

  tabIds.forEach((tabId, i) => {
    it(`is called with "null" when button "${i}" selected and clicked again`, () => {
      const onTabChange = jest.fn();
      const sideMenu = renderSideMenu({ onTabChange, selectedTab: tabId });
      sideMenu.find(`[data-testid="tabButton-${tabId}"]`).simulate("click");
      expect(onTabChange).toHaveBeenCalledWith(null);
    });
  });
});
