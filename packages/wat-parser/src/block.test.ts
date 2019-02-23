import { blockInstructions } from "./block"
import { parser as sParser } from "@ryohey/s-parser"

describe("block", () => {
  it("parses block-end", () => {
    const r = blockInstructions(["block", "i32.const", "42", "end"], 0)
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "block",
          identifier: null,
          results: [],
          body: [{ opType: "i32.const", parameter: { i32: "42" } }]
        }
      ],
      4
    ])
  })
  it("parses block with label", () => {
    const r = blockInstructions(["block", "$lbl", "i32.const", "42", "end"], 0)
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "block",
          identifier: "$lbl",
          results: [],
          body: [{ opType: "i32.const", parameter: { i32: "42" } }]
        }
      ],
      5
    ])
  })
  it("parses folded block", () => {
    const r = blockInstructions(
      [["block", ["result", "i32"], ["i32.const", "42"]]],
      0
    )
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "block",
          identifier: null,
          results: ["i32"],
          body: [{ opType: "i32.const", parameter: { i32: "42" } }]
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
    expect(r).toStrictEqual([
      true,
      [
        {
          body: [
            { opType: "call", parameter: "$dummy" },
            { opType: "f32.const", parameter: { f32: "3" } }
          ],
          identifier: null,
          opType: "block",
          results: ["f32"]
        }
      ],
      1
    ])
  })
})
