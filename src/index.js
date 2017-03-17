import React from "react";
import { render } from "react-dom";
import AppState from "./AppState";
import { init as initDatabase } from "./database";
import "./index.css";
import debugFactory from "debug";
const debug = debugFactory("gp:main");
debugFactory.log = console.log.bind(console);

async function run() {
  const db = await initDatabase(window);

  render(
    <AppState db={() => db} readFileAsText={readFileAsText} />,
    document.getElementById("root")
  );
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

run().catch(e => debug(e.stack || e));
