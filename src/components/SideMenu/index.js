// @flow

import React from "react";
import type { TabId } from "../../types";
import "./SideMenu.css";

const buttons: { tabId: TabId, text: string }[] = [
  { tabId: "edit", text: "Edit" }
];

type SideMenuProps = {
  onTabChange: (?TabId) => void,
  selectedTab: ?TabId
};

export default function SideMenu({ selectedTab, onTabChange }: SideMenuProps) {
  const buttonsElems = buttons.map(({ tabId, text }) => (
    <button
      key={tabId}
      className={selectedTab === tabId ? "isSelected" : null}
      data-testid={`tabButton-${tabId}`}
      onClick={() => onTabChange(selectedTab === tabId ? null : tabId)}
    >
      {text}
    </button>
  ));

  return (
    <div className="SideMenu">
      {buttonsElems}
    </div>
  );
}
