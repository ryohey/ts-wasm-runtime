import * as assert from "assert"
import { blockInstructions } from "./block"

describe("block", () => {
  it("parses block-end", () => {
    const r = blockInstructions(["block", "i32.const", 42, "end"], 0)
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "block",
          identifier: null,
          results: [],
          parameters: []
        },
        { opType: "i32.const", parameters: [42] },
        { opType: "end", parameters: [] }
      ],
      4
    ])
  })
  it("parses block with label", () => {
    const r = blockInstructions(["block", "$lbl", "i32.const", 42, "end"], 0)
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "block",
          identifier: "$lbl",
          results: [],
          parameters: []
        },
        { opType: "i32.const", parameters: [42] },
        { opType: "end", parameters: [] }
      ],
      5
    ])
  })
  it("parses folded block", () => {
    const r = blockInstructions(
      [["block", ["result", "i32"], ["i32.const", 42]]],
      0
    )
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "block",
          identifier: null,
          results: ["i32"],
          parameters: []
        },
        { opType: "i32.const", parameters: [42] },
        { opType: "end", parameters: [] }
      ],
      1
    ])
  })
})
