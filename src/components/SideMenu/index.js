import React, { PropTypes } from "react";
import { tabIds } from "../../types";
import "./SideMenu.css";

const buttons = [{ tabId: "edit", text: "Edit" }];

export default function SideMenu({ selectedTab, onTabChange }) {
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

SideMenu.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf(tabIds)
};
