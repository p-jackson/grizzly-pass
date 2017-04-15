// @flow

import React from "react";
import { connect } from "react-redux";
import type { State } from "../../reducer";
import { getTitle } from "../../reducer";
import Logo from "../Logo";
import Selectable from "../Selectable";
import "./Header.css";

export function Header({ title }: { title: ?string }) {
  const headerRight = title
    ? <h1 className="Header-right"><Selectable>{title}</Selectable></h1>
    : <div className="Header-right" />;

  return (
    <header className="Header">
      <div className="Header-left">
        <Logo />
      </div>
      {headerRight}
    </header>
  );
}

const HeaderState = connect((state: State) => ({
  title: getTitle(state)
}))(Header);

export default HeaderState;
