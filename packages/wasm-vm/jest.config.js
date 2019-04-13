module.exports = {
  ...require("../../jest.config.js"),
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      babelConfig: {
        plugins: ["@babel/plugin-syntax-bigint"]
      }
    }
  }
}
