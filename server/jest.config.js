/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};