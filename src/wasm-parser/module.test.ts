import * as assert from "assert"
import * as fs from "fs"
import { moduleParser } from "./module"

describe("module", () => {
  it("parses file", () => {
    const wasm = Array.from(fs.readFileSync("./src/wasm-parser/main.wasm"))
    const r = moduleParser(wasm, 0)
    assert.deepStrictEqual(r, [])
  })
})
