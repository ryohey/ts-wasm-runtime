import * as fs from "fs"
import { moduleParser } from "@ryohey/wasm-parser"
import { wasmToVMModule } from "./binary"
import { WASMVirtualMachine } from "./wasm-vm"
import { Int32 } from "./number"

describe("binary", () => {
  it("runs wasm binary", () => {
    const code = Array.from(fs.readFileSync("./fixtures/add.wasm"))
    expect(code).not.toBeNull()

    const r = moduleParser(code, 0)
    expect(r[0]).toBeTruthy()
    const module = wasmToVMModule(r[1])
    const vm = new WASMVirtualMachine(module)

    const received = vm.callFunction(
      "add",
      new Int32(234).toObject(),
      new Int32(346).toObject()
    )
    expect(received).toStrictEqual([new Int32(580).toObject()])
  })
})
