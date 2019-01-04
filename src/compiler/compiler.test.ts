import * as assert from "assert"
import { compile } from "./compiler"
import { ASTModule } from "../wasm-parser/module"
import { ValType } from "../wasm-parser/types"

describe("compiler", () => {
  it("compiles", () => {
    /*
      (module
        (func (export "add") (param i32) (param i32) (result i32)
          get_local 0 
          get_local 1
          i32.add
        )
      )
    */
    const ast: ASTModule = {
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
              type: ValType.i32
            },
            {
              identifier: null,
              type: ValType.i32
            }
          ],
          locals: [],
          result: ValType.i32,
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
    }
    const codes = compile(ast)
    assert.deepStrictEqual(codes, [
      [
        { opcode: "_push", parameters: [2] },
        { opcode: "get_local", parameters: [0] },
        { opcode: "get_local", parameters: [1] },
        { opcode: "i32.add", parameters: [] },
        { opcode: "_pop", parameters: [1] },
        { opcode: "_ret", parameters: [] }
      ],
      [
        {
          export: "add",
          locals: [],
          parameters: ["i32", "i32"],
          identifier: null,
          pointer: 0
        }
      ]
    ])
  })
})
