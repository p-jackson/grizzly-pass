import { projects } from "./demo-data";

test("project demo data", () => {
  expect(projects).toMatchSnapshot();
});
