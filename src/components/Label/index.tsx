import * as React from "react";
import "./Label.css";

interface LabelProps {
  initial: string;
  colour: string;
};

export default function Label({ initial, colour }: LabelProps) {
  return <div className="Label" style={{ background: colour }}>{initial}</div>;
}
