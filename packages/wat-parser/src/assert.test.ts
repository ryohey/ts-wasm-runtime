import * as assert from "assert"
import { parser as sParser } from "@ryohey/s-parser"
import { assertionParser } from "./assert"

describe("assertParser", () => {
  it("parses assert_return", () => {
    const sExp = sParser(
      `(assert_return (invoke "8u_good1" (i32.const 0) (i32.const 1)) (i32.const 97))`,
      0
    )
    const r = assertionParser(sExp[1], 0)
    assert.deepStrictEqual(r, [
      true,
      {
        nodeType: "assert_return",
        invoke: "8u_good1",
        args: [
          {
            opType: "i32.const",
            parameter: { i32: "0" }
          },
          {
            opType: "i32.const",
            parameter: { i32: "1" }
          }
        ],
        expected: [{ opType: "i32.const", parameter: { i32: "97" } }]
      },
      3
    ])
  })
  it("parses assert_return without parameters", () => {
    const sExp = sParser(`(assert_return (invoke "empty"))`, 0)
    const r = assertionParser(sExp[1], 0)
    assert.deepStrictEqual(r, [
      true,
      {
        nodeType: "assert_return",
        invoke: "empty",
        args: [],
        expected: []
      },
      2
    ])
  })
})
