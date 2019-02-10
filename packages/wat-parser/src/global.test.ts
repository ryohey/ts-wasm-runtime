import * as assert from "assert"
import { moduleGlobal } from "./global"

describe("global", () => {
  it("parses global", () => {
    const r = moduleGlobal(
      ["global", "$g0", ["mut", "i32"], ["i32.const", { int: "66560" }]],
      0
    )
    assert.deepEqual(r, [
      true,
      {
        export: null,
        identifier: "$g0",
        mutable: true,
        nodeType: "global",
        type: "i32"
      },
      4
    ])
  })
  it("parses global with export", () => {
    const r = moduleGlobal(
      [
        "global",
        "$__heap_base",
        ["export", `"__heap_base"`],
        "i32",
        ["i32.const", { int: "66560" }]
      ],
      0
    )
    assert.deepEqual(r, [
      true,
      {
        export: "__heap_base",
        identifier: "$__heap_base",
        mutable: false,
        nodeType: "global",
        type: "i32"
      },
      5
    ])
  })
})