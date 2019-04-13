module.exports = {
  projects: ["packages/*"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      babelConfig: {
        plugins: ["@babel/plugin-syntax-bigint"]
      }
    }
  },
  moduleFileExtensions: ["ts", "js"],
  roots: ["src"],
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}
