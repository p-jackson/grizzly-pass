import React from "react";
import { render } from "react-dom";
import App from "./App";
import { projects } from "./demo-data";
import "./index.css";

render(<App projects={projects} />, document.getElementById("root"));
