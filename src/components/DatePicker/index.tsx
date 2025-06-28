import moment from "moment";
import { SingleDatePicker } from "react-dates";
import { PureComponent } from "react";
import { uniqueId } from "lodash";
import "./DatePicker.scss";

interface Props {
  readonly: boolean;
  time: string;
  onTimeChange: (time: string) => void;
}

interface State {
  focused: boolean;
  date: moment.Moment;
}

export default class DatePicker extends PureComponent<Props, State> {
  state: State;
  private readonly id: string;

  constructor(props: Props) {
    super(props);
    this.id = uniqueId();
    this.state = {
      focused: false,
      date: moment(this.props.time),
    };
  }

  render() {
    const handleChange = (date: moment.Moment) => {
      this.setState({ date });
      this.props.onTimeChange(date.format());
    };

    const { focused, date } = this.state;

    return (
      <div className="DatePicker">
        <SingleDatePicker
          id={this.id}
          date={date}
          onDateChange={handleChange}
          focused={focused}
          onFocusChange={({ focused }) => this.setState({ focused: !!focused })}
          disabled={this.props.readonly}
          numberOfMonths={1}
          isOutsideRange={() => false}
          displayFormat="D MMMM"
        />
      </div>
    );
  }
}
