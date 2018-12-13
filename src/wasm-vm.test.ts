import * as assert from "assert"
import { parser as sParser } from "./s-parser"
import { moduleParser } from "./wasm-parser"
import { compile } from "./compiler"
import { WASMVirtualMachine } from "./wasm-vm"

describe("wasm-vm", () => {
  it("run", () => {
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
    assert(sExp[0])
    const ast = moduleParser(sExp[1], 0)
    assert(ast[0])
    const program = compile(ast[1])
    const vm = new WASMVirtualMachine()
    vm.instantiateModule(program[0], program[1])
    const memory = vm.callFunction("add")
    assert(true)
  })
})
