import * as assert from "assert"
import { operations } from "./operations"

describe("operations", () => {
  it("parses operator get_local with number", () => {
    const r = operations(["get_local", 0], 0)
    assert.deepEqual(r, [
      true,
      {
        opType: "get_local",
        parameters: 0
      },
      2
    ])
  })

  it("parses operator get_local with identifier", () => {
    const r = operations(["get_local", "$lhs"], 0)
    assert.deepEqual(r, [
      true,
      {
        opType: "get_local",
        parameters: "$lhs"
      },
      2
    ])
  })
})
