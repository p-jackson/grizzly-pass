import React from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <div className="App-sideMenu">
        <SideMenu />
      </div>
      <div className="App-header">
        <Header />
      </div>
      <p className="App-content">
        https://grizzly-pass.surge.sh
      </p>
    </div>
  );
}
