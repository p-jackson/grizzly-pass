import React from "react";
import { render } from "react-dom";
import AppState from "./components/AppState";
import { init as initDatabase } from "./database";
import { readFileAsText } from "./file-utils";
import "./index.css";
import debugFactory from "debug";
const debug = debugFactory("gp:main");
debugFactory.log = console.log.bind(console);

async function run() {
  const db = await initDatabase(window);

  render(
    <AppState db={() => db} readFileAsText={readFileAsText(FileReader)} />,
    document.getElementById("root")
  );
}

run().catch(e => debug(e.stack || e));
