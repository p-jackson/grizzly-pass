// @flow

import React from "react";
import { shallow } from "enzyme";
import ProgressBar from "../ProgressBar";
import { statusIds } from "../../types";

const progressBar = shallow(<ProgressBar progress={30} status="ontrack" />);

it("uses the progress prop to set the bar's width percentage", () => {
  expect(progressBar.find(".ProgressBar-inner").prop("style")).toMatchObject({
    width: "30%"
  });
});

describe("status styling", () => {
  statusIds.forEach(status => {
    it(`applies the css class for the "${status}" status`, () => {
      const progressBar = shallow(
        <ProgressBar progress={30} status={status} />
      );
      expect(progressBar.first().prop("className").split(" ")).toContain(
        `isStatus-${status}`
      );
    });
  });
});

describe("status text", () => {
  const statusText = [
    "On Track",
    "At Risk",
    "Intervention Required",
    "On Hold"
  ];

  statusIds.forEach((status, index) => {
    it(`displays status text for "${status}" status`, () => {
      const progressBar = shallow(
        <ProgressBar progress={30} status={status} />
      );
      expect(progressBar.find(".ProgressBar-text").text()).toBe(
        statusText[index]
      );
    });

    it(`displays "Done" text when progress is 100% for project with "${status}" status`, () => {
      const progressBar = shallow(
        <ProgressBar progress={100} status={status} />
      );
      expect(progressBar.find(".ProgressBar-text").text()).toBe("Done");
    });
  });
});
