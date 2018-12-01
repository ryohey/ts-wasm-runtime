import * as assert from "assert"
import { parser } from "./SParser"

describe("parser", () => {
  it("parse plain text", () => {
    const r = parser("abc", 0)
    assert.deepEqual(r, [true, "abc", 3])
  })

  it("parse single expression", () => {
    const r = parser("(oh yes)", 0)
    assert.deepEqual(r, [true, "", 8])
  })

  //   it("parse list", () => {
  //     const r = parser("(a b c)", 0)
  //     assert.deepEqual(r, {
  //       type: "a",
  //       children: ["b", "c"]
  //     })
  //   })

  //   it("parse nested expression", () => {
  //     const r = parser("(a (b c))", 0)
  //     assert.deepEqual(r, {
  //       type: "a",
  //       children: [
  //         {
  //           type: "b",
  //           children: ["c"]
  //         }
  //       ]
  //     })
  //   })
})
