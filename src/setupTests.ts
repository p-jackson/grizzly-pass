import * as debug from "debug";

// Debug package should use STDOUT instead of STDERR
(debug as any).log = console.log.bind(console);
