// jest.config.js
// Sync object
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  errorOnDeprecated: true,
  rootDir: './',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/tests/**/*.[jt]s?(x)'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
};
