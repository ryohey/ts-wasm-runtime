module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
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
