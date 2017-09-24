import * as debug from "debug";

// Debug package should use STDOUT instead of STDERR
(debug as any).log = console.log.bind(console);

let mockNextId = 1;
beforeEach(() => {
  mockNextId = 1;
});

jest.mock("lodash", () => ({
  uniqueId: () => (mockNextId++).toString(10)
}));
