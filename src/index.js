// @flow

import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render } from "react-dom";
import App from "./components/App";
import { readFileAsText } from "./file-utils";
import { loadDemoData } from "./actions";
import reducer from "./reducer";
import "./index.css";
import debugFactory from "debug";
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
