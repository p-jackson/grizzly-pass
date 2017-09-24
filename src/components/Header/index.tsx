import * as React from "react";
import { connect } from "react-redux";
import { getTitle, State } from "../../reducer";
import Logo from "../Logo";
import Selectable from "../Selectable";
import "./Header.css";

export function HeaderPresentation({ title }: { title?: string }) {
  const headerRight = title ? (
    <h1 className="Header-right">
      <Selectable>{title}</Selectable>
    </h1>
  ) : (
    <div className="Header-right" />
  );

  return (
    <header className="Header">
      <div className="Header-left">
        <Logo />
      </div>
      {headerRight}
    </header>
  );
}

const Header = connect((state: State) => ({
  title: getTitle(state)
}))(HeaderPresentation);

export default Header;
