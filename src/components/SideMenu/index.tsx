import * as React from "react";
import { TabId, tabIds } from "../../types";
import "./SideMenu.css";

const buttons: { tabId: TabId; text: string; }[] = [
  {
    tabId: "edit", text: "Edit"
  }
];

export interface SideMenuProps {
  onTabChange: (tab: TabId | null) => void;
  selectedTab?: TabId;
}

export default function SideMenu({ selectedTab, onTabChange }: SideMenuProps) {
  const buttonsElems = buttons.map(({ tabId, text }) => (
    <button
      key={tabId}
      className={selectedTab === tabId ? "isSelected" : undefined}
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
