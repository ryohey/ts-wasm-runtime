import * as assert from "assert"
import { param, funcBody, func } from "./func"
import { parser as sParser } from "../s-parser/s-parser"

describe("parser", () => {
  it("parse param", () => {
    const r = param(["param", "i32"], 0)
    assert.deepEqual(r, [true, { identifier: null, type: "i32" }, 2])
  })

  it("parse param with identifier", () => {
    const r = param(["param", "$p2", "f64"], 0)
    assert.deepEqual(r, [true, { identifier: "$p2", type: "f64" }, 3])
  })

  it("parse function body", () => {
    const r = funcBody(["get_local", "$lhs", "get_local", "$rhs"], 0)
    assert.deepEqual(r, [
      true,
      [
        {
          opType: "get_local",
          parameters: "$lhs"
        },
        {
          opType: "get_local",
          parameters: "$rhs"
        }
      ],
      4
    ])
  })

  it("parse function", () => {
    const r = func(
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
        identifier: null,
        export: null,
        parameters: [
          { identifier: "$lhs", type: "i32" },
          { identifier: "$rhs", type: "i32" }
        ],
        result: { type: "i32" },
        locals: null,
        body: [
          {
            opType: "get_local",
            parameters: "$lhs"
          },
          {
            opType: "get_local",
            parameters: "$rhs"
          },
          {
            opType: "i32.add",
            parameters: null
          }
        ]
      },
      9
    ])
  })

  it("parses function with export", () => {
    const r = func(
      [
        "func",
        "$add",
        ["export", `"add"`],
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
        identifier: "$add",
        export: "add",
        parameters: [
          { identifier: "$lhs", type: "i32" },
          { identifier: "$rhs", type: "i32" }
        ],
        result: { type: "i32" },
        locals: null,
        body: [
          {
            opType: "get_local",
            parameters: "$lhs"
          },
          {
            opType: "get_local",
            parameters: "$rhs"
          },
          {
            opType: "i32.add",
            parameters: null
          }
        ]
      },
      11
    ])
  })
  it("parses function", () => {
    const sExp = sParser(
      `(func (export "hello") (result i32)
        i32.const 42
      )`,
      0
    )
    const r = func(sExp[1], 0)
    assert.deepStrictEqual(r, [
      true,
      {
        body: [{ opType: "i32.const", parameters: 42 }],
        export: "hello",
        identifier: null,
        nodeType: "func",
        parameters: null,
        result: { type: "i32" },
        locals: null
      },
      5
    ])
  })
  it("parses function with local", () => {
    const sExp = sParser(
      `(func (export "hello") (result i32) (local i32)
        get_local 0
      )`,
      0
    )
    const r = func(sExp[1], 0)
    assert.deepStrictEqual(r, [
      true,
      {
        body: [{ opType: "get_local", parameters: 0 }],
        export: "hello",
        identifier: null,
        nodeType: "func",
        parameters: null,
        result: { type: "i32" },
        locals: ["i32"]
      },
      6
    ])
  })
})
