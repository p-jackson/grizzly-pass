// @flow

import React from "react";
import { connect } from "react-redux";
import { selectTab } from "../../actions";
import type { State } from "../../reducer";
import { getSelectedTab } from "../../reducer";
import type { TabId } from "../../types";
import "./SideMenu.css";

const buttons: { tabId: TabId, text: string }[] = [
  { tabId: "edit", text: "Edit" }
];

type SideMenuProps = {
  selectTab: ?TabId => void,
  selectedTab: ?TabId
};

export function SideMenuPresentation({
  selectedTab,
  selectTab
}: SideMenuProps) {
  const buttonsElems = buttons.map(({ tabId, text }) => (
    <button
      key={tabId}
      className={selectedTab === tabId ? "isSelected" : null}
      data-testid={`tabButton-${tabId}`}
      onClick={() => selectTab(selectedTab === tabId ? null : tabId)}
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

const mapStateToProps = (state: State) => ({
  selectedTab: getSelectedTab(state)
});

const mapDispatchToProps = {
  selectTab
};

const SideMenu = connect(mapStateToProps, mapDispatchToProps)(
  SideMenuPresentation
);

export default SideMenu;
