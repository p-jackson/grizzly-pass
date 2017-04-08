// @flow

import debug from "debug";

// Debug package should use STDOUT instead of STDERR
debug.log = console.log.bind(console);
