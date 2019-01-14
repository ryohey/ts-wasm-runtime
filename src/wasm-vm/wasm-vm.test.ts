import * as assert from "assert"
import { watParser } from "../wat-parser"
import { compile } from "../compiler/compiler"
import { WASMVirtualMachine } from "./wasm-vm"

const wasmTextCompiler = (text: string) => {
  return compile(watParser(text, 0)[1])
}

describe("wasm-vm", () => {
  it("hello world", () => {
    const module = wasmTextCompiler(
      `(module 
        (func (export "hello") (result i32)
          i32.const 42
        )
      )`
    )
    const vm = new WASMVirtualMachine(module)
    assert.deepStrictEqual(vm.callFunction("hello"), 42)
  })

  it("call add", () => {
    const module = wasmTextCompiler(
      `(module 
        (func (export "add") (param i32) (param i32) (result i32)
          get_local 0 
          get_local 1
          i32.add
        )
      )`
    )
    const vm = new WASMVirtualMachine(module)
    assert.deepStrictEqual(vm.callFunction("add", 133, 234), 367)
  })
})
