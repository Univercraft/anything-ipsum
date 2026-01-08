module.exports = {
  displayName: 'api-tests',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.tests.js'],
  verbose: true,
  collectCoverage: false,
  testTimeout: 30000, // 30 secondes pour les appels API externes
};
