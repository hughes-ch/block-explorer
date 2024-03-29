module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "space-before-function-paren": "off",
    "comma-dangle": "off",
    "require-jsdoc": "error"
  },
  ignorePatterns: ["*.test.js"],
}
