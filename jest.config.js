export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    moduleNameMapper: {
      '@includes/(.*)': '<rootDir>/src/includes/$1',
    },
  };