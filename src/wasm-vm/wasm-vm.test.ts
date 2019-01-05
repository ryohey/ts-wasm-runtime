import * as assert from "assert"
import { parser as sParser } from "../s-parser/s-parser"
import { wasmParser } from "../wasm-parser"
import { compile } from "../compiler/compiler"
import { WASMVirtualMachine } from "./wasm-vm"

const wasmTextParser = (text: string) => {
  const sExp = sParser(text, 0)
  assert(sExp[0], sExp[3])
  const ast = wasmParser(sExp[1], 0)
  assert(ast[0], ast[3])
  return ast[1]
}

const wasmTextCompiler = (text: string) => {
  return compile(wasmTextParser(text))
}

describe("wasm-vm", () => {
  it("hello world", () => {
    const program = wasmTextCompiler(
      `(module 
        (func (export "hello") (result i32)
          i32.const 42
        )
      )`
    )
    const vm = new WASMVirtualMachine()
    vm.instantiateModule(program[0], program[1])
    const memory = vm.callFunction("hello")
    assert.deepStrictEqual(memory.values.peek(), 42)
  })

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

  it("runs fibonacci", () => {
    const program = wasmTextCompiler(
      `(module
        (func $fib (export "fib") (param $p0 i32) (result i32) (local $l0 i32)
          i32.const 1
          set_local $l0
          block $B0
            get_local $p0
            i32.const 2
            i32.lt_u
            br_if $B0
            i32.const 1
            set_local $l0
            loop $L1
              get_local $p0
              i32.const -1
              i32.add
              call $fib
              get_local $l0
              i32.add
              set_local $l0
              get_local $p0
              i32.const -2
              i32.add
              tee_local $p0
              i32.const 1
              i32.gt_u
              br_if $L1
            end
          end
          get_local $l0
        )
      )`
    )
    const vm = new WASMVirtualMachine()
    vm.instantiateModule(program[0], program[1])
    const memory = vm.callFunction("fib", 133)
    assert.deepStrictEqual(memory.values.peek(), 367)
  })
})
