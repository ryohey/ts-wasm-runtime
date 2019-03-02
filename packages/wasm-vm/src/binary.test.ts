import * as fs from "fs"
import { moduleParser } from "@ryohey/wasm-parser"
import { wasmToVMModule } from "./binary"
import { WASMVirtualMachine } from "./wasm-vm"

describe("binary", () => {
  it("runs wasm binary", () => {
    const code = Array.from(fs.readFileSync("./fixtures/add.wasm"))
    expect(code).not.toBeNull()

    const r = moduleParser(code, 0)
    expect(r[0]).toBeTruthy()
    const module = wasmToVMModule(r[1])
    const vm = new WASMVirtualMachine(module)

    const received = vm.callFunction("add", { i32: "234" }, { i32: "346" })
    expect(received).toStrictEqual([{ i32: "580" }])
  })
})
