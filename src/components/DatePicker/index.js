// @flow

import React, { Component } from "react";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import "./build/DatePicker.css";

type Props = {
  readonly: boolean,
  time: string,
  onTimeChange: (string) => void
};

type State = {
  focused: boolean,
  date: moment$Moment
};

export default class DatePicker extends Component<void, Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      focused: false,
      date: moment(this.props.time)
    };
  }

  render() {
    const handleChange = date => {
      this.setState({ date });
      this.props.onTimeChange(date.format());
    };

    const { focused, date } = this.state;

    return (
      <SingleDatePicker
        date={date}
        onDateChange={handleChange}
        focused={focused}
        onFocusChange={({ focused }) => this.setState({ focused })}
        disabled={this.props.readonly}
        numberOfMonths={1}
        isOutsideRange={() => false}
        displayFormat="D MMMM"
      />
    );
  }
}
