//# jest.config.ts

import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
  '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  roots : [
    "<rootDir>/src"
  ],
  testMatch : [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom'
};
export default config;





//module.exports = {
//    "roots": [
//      "<rootDir>/src"
//    ],
//    "testMatch": [
//      "**/__tests__/**/*.+(ts|tsx|js)",
//      "**/?(*.)+(spec|test).+(ts|tsx|js)"
//    ],
//    "transform": {
//      "^.+\\.(ts|tsx)$": "ts-jest"
//    },
//    setupFilesAfterEnv: ['./jest.setup.js'],
//    testEnvironment: 'jsdom'
//  }

  