// @flow

import React from "react";
import { SingleDatePicker } from "react-dates";
import { shallow } from "enzyme";
import moment from "moment";
import DatePicker from "../DatePicker";

function renderDatePicker(
  {
    readonly = false,
    time = "2017-04-08T11:04:13.234Z",
    handleTimeChange = jest.fn()
  }: {
    readonly?: boolean,
    time?: string,
    handleTimeChange?: (string) => void
  } = {}
) {
  return shallow(
    <DatePicker
      readonly={readonly}
      time={time}
      onTimeChange={handleTimeChange}
    />
  );
}

it("it only displays a single month", () => {
  const picker = renderDatePicker();
  expect(picker.find(SingleDatePicker).prop("numberOfMonths")).toBe(1);
});

it("passes the time as a moment object to the SDP", () => {
  const time = "2017-04-08T11:04:13.234Z";
  const picker = renderDatePicker({ time });
  expect(picker.find(SingleDatePicker).prop("date")).toEqual(moment(time));
});

it("disables the SDP if readonly", () => {
  const picker = renderDatePicker({ readonly: true });
  expect(picker.find(SingleDatePicker).prop("disabled")).toBe(true);
});

it("enables the SDP if not readonly", () => {
  const picker = renderDatePicker({ readonly: false });
  expect(picker.find(SingleDatePicker).prop("disabled")).toBe(false);
});

it("allows users to choose dates in the past", () => {
  const picker = renderDatePicker();
  const rangeChecker = picker.find(SingleDatePicker).prop("isOutsideRange");
  expect(rangeChecker(moment().subtract(1, "day"))).toBe(false);
});

it("keeps the focus prop in sync with the onFocusChange event", () => {
  const picker = renderDatePicker();
  const onFocusChange = picker.find(SingleDatePicker).prop("onFocusChange");
  onFocusChange({ focused: true });
  expect(picker.find(SingleDatePicker).prop("focused")).toBe(true);
  onFocusChange({ focused: false });
  expect(picker.find(SingleDatePicker).prop("focused")).toBe(false);
});

it("calls onTimeChange prop when date is changed", () => {
  const handleTimeChange = jest.fn();
  const picker = renderDatePicker({ handleTimeChange });
  const onDateChange = picker.find(SingleDatePicker).prop("onDateChange");
  const now = moment();
  onDateChange(now);
  expect(handleTimeChange).toHaveBeenCalledWith(now.format());
});
