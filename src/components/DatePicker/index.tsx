import { format, formatISO } from "date-fns";
import { PureComponent } from "react";
import { uniqueId } from "../../unique-id";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  readonly: boolean;
  time: string;
  onTimeChange: (time: string) => void;
}

interface State {
  date: Date;
  open: boolean;
}

export default class DatePicker extends PureComponent<Props, State> {
  state: State;
  private readonly id: string;

  constructor(props: Props) {
    super(props);
    this.id = uniqueId();
    this.state = {
      date: new Date(this.props.time),
      open: false,
    };
  }

  render() {
    const handleSelect = (date: Date) => {
      this.setState({ date });
      this.props.onTimeChange(formatISO(date));
    };

    const { open, date } = this.state;

    return (
      <div className="DatePicker">
        <Popover open={open} onOpenChange={(open) => this.setState({ open })}>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={this.props.readonly}>
              {format(date, "d MMMM")}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              id={this.id}
              mode="single"
              selected={date}
              defaultMonth={date}
              captionLayout="dropdown"
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
}
