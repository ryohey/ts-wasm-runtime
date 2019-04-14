import { moduleType } from "./type"

describe("type section", () => {
  it("func", () => {
    const r = moduleType(
      ["type", "$check", ["func", ["param", "i32", "i32"], ["result", "i32"]]],
      0
    )
    expect(r).toStrictEqual([
      true,
      {
        identifier: "$check",
        parameters: [
          { identifier: null, type: "i32" },
          { identifier: null, type: "i32" }
        ],
        results: ["i32"],
        nodeType: "type"
      },
      3
    ])
  })
})
