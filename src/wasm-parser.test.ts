import * as assert from "assert"
import { parser, param, funcBody, num } from "./wasm-parser"

describe("parser", () => {
  it("parse param", () => {
    const r = param(["param", "i32"], 0)
    assert.deepEqual(r, [
      true,
      { nodeType: "param", name: null, type: "i32" },
      2
    ])
  })

  it("parse param with name", () => {
    const r = param(["param", "$p2", "f64"], 0)
    assert.deepEqual(r, [
      true,
      { nodeType: "param", name: "$p2", type: "f64" },
      3
    ])
  })

  it("parses num", () => {
    const r = num([3.14], 0)
    assert.deepEqual(r, [true, 3.14, 1])
  })

  it("parse function body", () => {
    const r = funcBody(["get_local", "$lhs", "get_local", "$rhs"], 0)
    assert.deepEqual(r, [
      true,
      [
        {
          nodeType: "op",
          opType: "get_local",
          parameters: "$lhs"
        },
        {
          nodeType: "op",
          opType: "get_local",
          parameters: "$rhs"
        }
      ],
      2
    ])
  })

  it("parse function", () => {
    const r = parser(
      [
        "func",
        ["param", "$lhs", "i32"],
        ["param", "$rhs", "i32"],
        ["result", "i32"],
        "get_local",
        "$lhs",
        "get_local",
        "$rhs",
        "i32.add"
      ],
      0
    )
    assert.deepEqual(r, [
      true,
      {
        nodeType: "func",
        parameters: [
          { nodeType: "param", name: "$lhs", type: "i32" },
          { nodeType: "param", name: "$rhs", type: "i32" }
        ],
        result: { nodeType: "result", type: "i32" },
        body: [
          {
            nodeType: "op",
            opType: "get_local",
            parameters: "$lhs"
          },
          {
            nodeType: "op",
            opType: "get_local",
            parameters: "$rhs"
          },
          {
            nodeType: "op",
            opType: "i32.add",
            parameters: null
          }
        ]
      },
      7
    ])
  })
})
