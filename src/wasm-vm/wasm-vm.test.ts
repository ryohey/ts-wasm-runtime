import * as assert from "assert"
import { parser as sParser } from "../s-parser/s-parser"
import { wasmParser } from "../wasm-parser"
import { wastParser } from "../wasm-parser/wast"
import { compile } from "../compiler/compiler"
import { WASMVirtualMachine } from "./wasm-vm"
import { ASTAssertReturn } from "../wasm-parser/assert"
import { ASTModuleNode } from "../wasm-parser/types"
import { ASTModule } from "../wasm-parser/module"

const wasmTextParser = (text: string) => {
  const sExp = sParser(text, 0)
  assert(sExp[0])
  const ast = wasmParser(sExp[1], 0)
  assert(ast[0])
  return ast[1]
}

const wasmTextCompiler = (text: string) => {
  return compile(wasmTextParser(text))
}

const isAssertReturn = (n: ASTModuleNode): n is ASTAssertReturn =>
  n.nodeType === "assert_return"

const isModule = (n: ASTModuleNode): n is ASTModule => n.nodeType === "module"

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

  it("runs test case", () => {
    const r = wastParser(
      `(module
        (func (export "type-local-i32") (result i32) (local i32)
          get_local 0
        )
      )
      (assert_return (invoke "type-local-i32") (i32.const 0))`,
      0
    )
    const testCases: ASTAssertReturn[] = r[1].filter(isAssertReturn)
    const modules = r[1].filter(isModule)

    const vm = new WASMVirtualMachine()
    const program = compile(modules[0])
    vm.instantiateModule(program[0], program[1])

    for (const test of testCases) {
      vm.runTestCase(test)
    }
  })
})
