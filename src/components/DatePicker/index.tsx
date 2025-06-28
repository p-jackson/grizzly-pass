import moment from "moment";
import { SingleDatePicker } from "react-dates";
import { formatISO } from "date-fns";
import { PureComponent } from "react";
import { uniqueId } from "../../unique-id";
import "./DatePicker.scss";

interface Props {
  readonly: boolean;
  time: string;
  onTimeChange: (time: string) => void;
}

interface State {
  focused: boolean;
  date: Date;
}

export default class DatePicker extends PureComponent<Props, State> {
  state: State;
  private readonly id: string;

  constructor(props: Props) {
    super(props);
    this.id = uniqueId();
    this.state = {
      focused: false,
      date: new Date(this.props.time),
    };
  }

  render() {
    const handleChange = (date: moment.Moment) => {
      const asDate = new Date(date.format());
      this.setState({ date: asDate });
      this.props.onTimeChange(formatISO(asDate));
    };

    const { focused, date } = this.state;

    return (
      <div className="DatePicker">
        <SingleDatePicker
          id={this.id}
          date={moment(date)}
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
