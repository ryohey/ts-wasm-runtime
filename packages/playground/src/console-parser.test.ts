import * as assert from "assert"
import { parseConsoleInput } from "./console-parser"

describe("console-parser", () => {
  it("parseConsoleInput", () => {
    const r = parseConsoleInput("abc(1, 2, 3)", 0)
    assert.deepEqual(r, [
      true,
      {
        type: "func-call",
        name: "abc",
        arguments: ["1", "2", "3"]
      },
      10
    ])
  })
})
