import debug from "debug";

// Debug package should use STDOUT instead of STDERR
debug.log = console.log.bind(console);

let mockNextId = 1;
beforeEach(() => {
  mockNextId = 1;
});

vi.mock("./unique-id", () => ({
  uniqueId: () => (mockNextId++).toString(10),
}));
