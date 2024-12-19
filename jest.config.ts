/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from "next/jest.js";

import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",

  collectCoverage: true,
  coverageProvider: "v8",
  coveragePathIgnorePatterns: ["/node_modules/", "/.next/"],
  coverageDirectory: "coverage",

  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^lodash-es$": "lodash",
  },

  // Handle JSON imports
  transformIgnorePatterns: ["/node_modules/(?!lodash-es).+\\.js$"],

  // Enable ES modules
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
