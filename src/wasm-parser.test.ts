import * as assert from "assert"
import { moduleParser, func, param, funcBody, num, op } from "./wasm-parser"

describe("parser", () => {
  it("parse param", () => {
    const r = param(["param", "i32"], 0)
    assert.deepEqual(r, [true, { identifier: null, type: "i32" }, 2])
  })

  it("parse param with identifier", () => {
    const r = param(["param", "$p2", "f64"], 0)
    assert.deepEqual(r, [true, { identifier: "$p2", type: "f64" }, 3])
  })

  it("parses num", () => {
    const r = num([3.14], 0)
    assert.deepEqual(r, [true, 3.14, 1])
  })

  it("parses operator get_local with number", () => {
    const r = op(["get_local", 0], 0)
    assert.deepEqual(r, [
      true,
      {
        opType: "get_local",
        parameters: 0
      },
      2
    ])
  })

  it("parses operator get_local with identifier", () => {
    const r = op(["get_local", "$lhs"], 0)
    assert.deepEqual(r, [
      true,
      {
        opType: "get_local",
        parameters: "$lhs"
      },
      2
    ])
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
        ["export", "add"],
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

  it("parses module", () => {
    const r = moduleParser(
      [
        "module",
        [
          "func",
          ["export", "add"],
          ["param", "i32"],
          ["param", "i32"],
          ["result", "i32"],
          "get_local",
          0,
          "get_local",
          1,
          "i32.add"
        ]
      ],
      0
    )
    assert.deepEqual(r, [
      true,
      [
        "module",
        [
          {
            nodeType: "func",
            identifier: null,
            export: "add",
            parameters: [
              {
                identifier: null,
                type: "i32"
              },
              {
                identifier: null,
                type: "i32"
              }
            ],
            result: {
              type: "i32"
            },
            body: [
              {
                opType: "get_local",
                parameters: 0
              },
              {
                opType: "get_local",
                parameters: 1
              },
              {
                opType: "i32.add",
                parameters: null
              }
            ]
          }
        ]
      ],
      2
    ])
  })
})
