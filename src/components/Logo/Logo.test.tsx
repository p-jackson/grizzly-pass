// @vitest-environment jsdom
import { render } from "@testing-library/react";
import Logo from "../Logo";

it("contains the letters GP", () => {
  const { container } = render(<Logo />);
  expect(container).toHaveTextContent("GP");
});
