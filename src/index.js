import React from "react";
import { render } from "react-dom";
import AppState from "./AppState";
import "./index.css";

render(
  <AppState readFileAsText={readFileAsText} />,
  document.getElementById("root")
);

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
