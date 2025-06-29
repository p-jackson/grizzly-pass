import debugFactory from "debug";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { loadDemoData } from "./actions";
import App from "./components/App";
import { readFileAsText } from "./file-utils";
import reducer from "./reducer";
import "./index.css";

const debug = debugFactory("gp:main");
debugFactory.log = console.log.bind(console);

async function run() {
  console.log(__APP_VERSION__);

  const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  );
  store.dispatch(loadDemoData());

  const root = createRoot(document.getElementById("root")!);
  root.render(
    <Provider store={store}>
      <App readFileAsText={readFileAsText(FileReader)} />
    </Provider>,
  );
}

run().catch((e) => debug(e.stack || e));
