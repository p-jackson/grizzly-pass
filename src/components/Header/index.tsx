import * as React from "react";
import Logo from "../Logo";
import Selectable from "../Selectable";
import "./Header.css";

export default function Header({ title }: { title?: string }) {
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
