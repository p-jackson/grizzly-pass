// @flow

import debugFactory from "debug";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { loadDemoData } from "./actions";
import App from "./components/App";
import { readFileAsText } from "./file-utils";
import reducer from "./reducer";
import "./index.css";

const debug = debugFactory("gp:main");
debugFactory.log = console.log.bind(console);

const { version: appVersion } = require("../package.json");

async function run() {
  console.log(appVersion);

  const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  store.dispatch(loadDemoData());

  render(
    <Provider store={store}>
      <App readFileAsText={readFileAsText(FileReader)} />
    </Provider>,
    document.getElementById("root")
  );
}

run().catch(e => debug(e.stack || e));
