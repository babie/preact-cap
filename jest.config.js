module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'jest-environment-jsdom-global',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
}
