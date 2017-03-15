import React from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Card from "./Card";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <div className="App-sideMenu">
        <SideMenu />
      </div>
      <div className="App-header">
        <Header title="Dummy Projects 2017" />
      </div>
      <div className="App-content">
        <Card
          title="Coffee Swirl"
          person="Joe Lemon"
          progress={13}
          status="ontrack"
        />
      </div>
    </div>
  );
}
