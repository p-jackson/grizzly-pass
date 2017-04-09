// @flow

import React from "react";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import type { LabelInfo } from "../../types";
import "./Label.css";

type LabelProps = {
  labelInfo: LabelInfo,
  readonly: boolean
};

export default function Label({ labelInfo, readonly }: LabelProps) {
  const { initial, colour, title } = labelInfo;
  if (readonly)
    return (
      <div className="Label" title={title} style={{ background: colour }}>
        {initial}
      </div>
    );
  else
    return (
      <Wrapper onSelection={() => {}} className="Label-wrapper">
        <Button
          className="Label Label-button"
          title={title}
          style={{ background: colour }}
        >
          {initial}
        </Button>
        <Menu className="Label-menu">
          <ul>{renderMenuItems(["Apple", "Orange", "Banana"])}</ul>
        </Menu>
      </Wrapper>
    );
}

function renderMenuItems(labelTitles: string[]) {
  return labelTitles.map(title => (
    <li key={title}>
      <MenuItem className="Label-menuItem">
        {title}
      </MenuItem>
    </li>
  ));
}
