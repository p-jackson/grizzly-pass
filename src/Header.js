import React from "react";
import Logo from "./Logo";
import "./Header.css";

export default function Header() {
  return (
    <header className="Header">
      <div className="Header-left">
        <Logo />
      </div>
      <div className="Header-right" />
    </header>
  );
}
