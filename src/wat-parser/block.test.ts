import * as assert from "assert"
import { blockInstructions } from "./block"
import { parser as sParser } from "../s-parser/s-parser"

describe("block", () => {
  it("parses block-end", () => {
    const r = blockInstructions(["block", "i32.const", { int: "42" }, "end"], 0)
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "block",
          identifier: null,
          results: [],
          parameters: [],
          body: [{ opType: "i32.const", parameters: [{ i32: "42" }] }]
        }
      ],
      4
    ])
  })
  it("parses block with label", () => {
    const r = blockInstructions(
      ["block", "$lbl", "i32.const", { int: "42" }, "end"],
      0
    )
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "block",
          identifier: "$lbl",
          results: [],
          parameters: [],
          body: [{ opType: "i32.const", parameters: [{ i32: "42" }] }]
        }
      ],
      5
    ])
  })
  it("parses folded block", () => {
    const r = blockInstructions(
      [["block", ["result", "i32"], ["i32.const", { int: "42" }]]],
      0
    )
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "block",
          identifier: null,
          results: ["i32"],
          parameters: [],
          body: [{ opType: "i32.const", parameters: [{ i32: "42" }] }]
        }
      ],
      1
    ])
  })
  it("parses multiple instructions", () => {
    const sExp = sParser(
      `((block (result f32) (call $dummy) (f32.const 3)))`,
      0
    )
    const r = blockInstructions(sExp[1], 0)
    assert.deepEqual(r, [
      true,
      [
        {
          body: [
            { opType: "call", parameters: ["$dummy"] },
            { opType: "f32.const", parameters: [{ f32: "3" }] }
          ],
          identifier: null,
          opType: "block",
          parameters: [],
          results: ["f32"]
        }
      ],
      1
    ])
  })
})
