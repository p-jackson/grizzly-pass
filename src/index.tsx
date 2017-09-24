import * as debugFactory from "debug";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { loadDemoData } from "./actions";
import App from "./components/App";
import { readFileAsText } from "./file-utils";
import reducer from "./reducer";
import "./index.css";

const debug = debugFactory("gp:main");
(debugFactory as any).log = console.log.bind(console);

const { version: appVersion } = require("../package.json");

async function run() {
  console.log(appVersion);

  const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
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
