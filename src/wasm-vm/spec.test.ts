import { runTests } from "./test-runner"
import * as fs from "fs"
import * as path from "path"

const SPEC_DIR = "./spec"

describe("spec test", () => {
  const files = fs
    .readdirSync(SPEC_DIR)
    .filter(f => f.endsWith(".wast"))
    .map(f => path.join(SPEC_DIR, f))

  files.forEach(file => {
    it(`${file}`, () => {
      const code = fs.readFileSync(file, "utf8")
      runTests(code)
    })
  })
})
