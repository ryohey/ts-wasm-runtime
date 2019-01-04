import * as assert from "assert"
import { parser as sParser } from "../s-parser/s-parser"
import { moduleParser } from "./module"

describe("module parser", () => {
  it("parses module", () => {
    const r = moduleParser(
      [
        "module",
        [
          "func",
          ["export", `"add"`],
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
      {
        nodeType: "module",
        exports: [],
        functions: [
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
            result: "i32",
            locals: [],
            body: [
              {
                opType: "get_local",
                parameters: [0]
              },
              {
                opType: "get_local",
                parameters: [1]
              },
              {
                opType: "i32.add",
                parameters: []
              }
            ]
          }
        ]
      },
      2
    ])
  })
  it("parses modules from string", () => {
    const sExp = sParser(
      `(module 
        (func (export "add") (param i32) (param i32) (result i32)
          get_local 0 
          get_local 1
          i32.add
        )
      )`,
      0
    )

    const r = moduleParser(sExp[1], 0)

    assert.deepStrictEqual(r, [
      true,
      {
        nodeType: "module",
        exports: [],
        functions: [
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
            result: "i32",
            locals: [],
            body: [
              {
                opType: "get_local",
                parameters: [0]
              },
              {
                opType: "get_local",
                parameters: [1]
              },
              {
                opType: "i32.add",
                parameters: []
              }
            ]
          }
        ]
      },
      2
    ])
  })
})
