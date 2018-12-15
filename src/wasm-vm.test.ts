import * as assert from "assert"
import { parser as sParser } from "./s-parser"
import { moduleParser } from "./wasm-parser"
import { compile } from "./compiler"
import { WASMVirtualMachine } from "./wasm-vm"

const wasmTextCompiler = (text: string) => {
  const sExp = sParser(text, 0)
  assert(sExp[0])
  const ast = moduleParser(sExp[1], 0)
  assert(ast[0])
  return compile(ast[1])
}

describe("wasm-vm", () => {
  it("call add", () => {
    const program = wasmTextCompiler(
      `(module 
        (func (export "add") (param i32) (param i32) (result i32)
          get_local 0 
          get_local 1
          i32.add
        )
      )`
    )
    const vm = new WASMVirtualMachine()
    vm.instantiateModule(program[0], program[1])
    const memory = vm.callFunction("add", 133, 234)
    assert.deepStrictEqual(memory.values.peek(), 367)
  })
})
