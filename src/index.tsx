import * as React from "react";
import { render } from "react-dom";
import AppState from "./components/AppState";
import { init as initDatabase } from "./database";
import { readFileAsText } from "./file-utils";
import * as packageJson from "../package.json";
import "./index.css";
import * as debugFactory from "debug";
const debug = debugFactory("gp:main");
(debugFactory as any).log = console.log.bind(console);


async function run() {
  console.log(packageJson.version);
  const db = await initDatabase(window);
  if (db === null)
    return;

  render(
    <AppState db={() => db} readFileAsText={readFileAsText(FileReader)} />,
    document.getElementById("root")
  );
}

run().catch(e => debug(e.stack || e));
