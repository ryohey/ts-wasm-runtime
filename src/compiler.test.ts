import * as assert from "assert"
import { compile } from "./compiler"
import { ASTModule } from "./wasm-parser"

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
    }
    const codes = compile(ast)
    assert.deepStrictEqual(codes, [
      [
        { opcode: "get_local", value: 0 },
        { opcode: "get_local", value: 1 },
        { opcode: "i32.add", value: null },
        { opcode: "return" }
      ],
      [{ export: "add", identifier: null, pointer: 0 }]
    ])
  })
})
