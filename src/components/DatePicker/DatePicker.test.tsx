// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatePicker from "../DatePicker";

function renderDatePicker({
  readonly = false,
  time = "2017-04-08T11:04:13.234Z",
  handleTimeChange = vi.fn(),
}: {
  readonly?: boolean;
  time?: string;
  handleTimeChange?: (time: string) => void;
} = {}) {
  return render(
    <DatePicker
      readonly={readonly}
      time={time}
      onTimeChange={handleTimeChange}
    />,
  );
}

it("it only displays a single month", async () => {
  const user = userEvent.setup();
  renderDatePicker();
  await user.click(screen.getByRole("button"));
  expect(screen.getAllByRole("grid")).toHaveLength(1);
});

it("selects the time prop when first opened", async () => {
  const user = userEvent.setup();
  const time = "2017-04-08T11:04:13.234Z";

  renderDatePicker({ time });
  await user.click(screen.getByRole("button", { name: "8 April" }));

  expect(screen.getByRole("button", { name: /selected/ })).toHaveTextContent(
    "8",
  );
});

it("disables the date picker if readonly", () => {
  renderDatePicker({ readonly: true });
  expect(screen.getByRole("button", { name: "8 April" })).toBeDisabled();
});

it("enables the date picker if not readonly", () => {
  renderDatePicker({ readonly: false });
  expect(screen.getByRole("button", { name: "8 April" })).toBeEnabled();
});

it("calls onTimeChange prop when date is changed", async () => {
  const user = userEvent.setup();
  const handleTimeChange = vi.fn();
  const time = "2017-04-08T11:04:13.234Z";

  renderDatePicker({ time, handleTimeChange });
  await user.click(screen.getByRole("button", { name: "8 April" }));
  await user.click(screen.getByRole("button", { name: /22/ }));

  expect(handleTimeChange).toHaveBeenCalledWith(
    expect.stringMatching(/^2017-04-22/),
  );
  expect(screen.getByRole("button", { name: "22 April" })).toBeInTheDocument();
});
