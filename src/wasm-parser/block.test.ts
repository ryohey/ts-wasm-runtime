import * as assert from "assert"
import { blockInstructions } from "./block"

describe("block", () => {
  it("parse block-end", () => {
    const r = blockInstructions(["block", "i32.const", 42, "end"], 0)
    assert.deepEqual(r, [
      true,
      [
        { opType: "block", parameters: [] },
        { opType: "i32.const", parameters: [42] }
      ],
      4
    ])
  })
  it("parse block with label", () => {
    const r = blockInstructions(["block", "$lbl", "i32.const", 42, "end"], 0)
    assert.deepEqual(r, [
      true,
      [
        { opType: "block", parameters: [] },
        { opType: "i32.const", parameters: [42] }
      ],
      5
    ])
  })
  it("parse block-end", () => {
    const r = blockInstructions(["block", "i32.const", 42, "end"], 0)
    assert.deepEqual(r, [
      true,
      [
        { opType: "block", parameters: [] },
        { opType: "i32.const", parameters: [42] }
      ],
      4
    ])
  })
  it("parse folded block", () => {
    const r = blockInstructions([["block", ["i32.const", 42]]], 0)
    assert.deepEqual(r, [
      true,
      [
        { opType: "block", parameters: [] },
        { opType: "i32.const", parameters: [42] }
      ],
      1
    ])
  })
})
