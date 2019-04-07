import { watParser } from "@ryohey/wat-parser"
import { WASMVirtualMachine } from "./wasm-vm"
import { watModuleToWasmModule } from "./wat"
import { Int32 } from "./number"

const wasmTextCompiler = (text: string) => {
  return watModuleToWasmModule(watParser(text, 0)[1])
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
    expect(vm.callFunction("hello")).toStrictEqual([new Int32(42).toObject()])
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
    expect(
      vm.callFunction(
        "add",
        new Int32(133).toObject(),
        new Int32(234).toObject()
      )
    ).toStrictEqual([new Int32(367).toObject()])
  })
})
