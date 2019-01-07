import * as assert from "assert"
import { plainInstructions } from "./operations"

describe("plainInstructions", () => {
  it("parses operator get_local with number", () => {
    const r = plainInstructions(["get_local", 0], 0)
    assert.deepEqual(r, [
      true,
      {
        opType: "get_local",
        parameters: [0]
      },
      2
    ])
  })

  it("parses operator get_local with identifier", () => {
    const r = plainInstructions(["get_local", "$lhs"], 0)
    assert.deepEqual(r, [
      true,
      {
        opType: "get_local",
        parameters: ["$lhs"]
      },
      2
    ])
  })
})
