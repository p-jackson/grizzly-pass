module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/src/setup-tests.ts",
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  mapCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!src/**/*.stories.{ts,tsx}"
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/__mocks__/style-mock.ts"
  }
};

// Have TypeScript emit es5 when running Node 6
if (parseInt(process.versions.node, 10) < 7) {
  module.exports.globals = {
    "ts-jest": {
      tsConfigFile: "tsconfig-es5.json"
    }
  };
}
