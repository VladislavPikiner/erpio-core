module.exports = {
  preset: 'jest-environment-puppeteer',
  testMatch: ['**/e2e/**/*.spec.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
};