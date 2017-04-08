// @flow

import React from "react";
import type { LabelInfo } from "../../types";
import "./Label.css";

export default function Label({ labelInfo }: { labelInfo: LabelInfo }) {
  const { initial, colour, title } = labelInfo;
  return (
    <div className="Label" title={title} style={{ background: colour }}>
      {initial}
    </div>
  );
}
