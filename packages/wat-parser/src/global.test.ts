import { moduleGlobal } from "./global"

describe("global", () => {
  it("parses global", () => {
    const r = moduleGlobal(
      ["global", "$g0", ["mut", "i32"], ["i32.const", "66560"]],
      0
    )
    expect(r).toStrictEqual([
      true,
      {
        export: null,
        identifier: "$g0",
        mutable: true,
        nodeType: "global",
        init: { opType: "i32.const", parameter: { i32: 66560 } },
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
        ["i32.const", "66560"]
      ],
      0
    )
    expect(r).toStrictEqual([
      true,
      {
        export: "__heap_base",
        identifier: "$__heap_base",
        mutable: false,
        nodeType: "global",
        init: { opType: "i32.const", parameter: { i32: 66560 } },
        type: "i32"
      },
      5
    ])
  })
})
