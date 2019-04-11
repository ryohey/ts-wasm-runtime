import * as assert from "assert"
import { wastParser, WATAssertReturn, WATModule } from "@ryohey/wat-parser"
import { WASMVirtualMachine } from "./wasm-vm"
import { convertNumber } from "./number/convert"
import { watModuleToWasmModule } from "./wat"

type ASTTopNode = WATModule | WATAssertReturn

const isAssertReturn = (n: ASTTopNode): n is WATAssertReturn =>
  n.nodeType === "assert_return"

const isModule = (n: ASTTopNode): n is WATModule => n.nodeType === "module"

const runTestCase = (
  vm: WASMVirtualMachine,
  ast: WATAssertReturn,
  verbose: boolean = false
) => {
  const log = (msg: string) => {
    if (verbose) {
      console.log(msg)
    }
  }
  log(`Testing ${ast.invoke}...`)
  const received = vm.callFunction(
    ast.invoke,
    ...ast.args.map(a => a.parameter)
  )
  for (let i = 0; i < received.length; i++) {
    const exp = ast.expected[i]
    const receivedValue = convertNumber(received[i]).toObject()
    const expectedValue = convertNumber(exp.parameter).toObject()
    expect(receivedValue).toStrictEqual(expectedValue)
  }
  log(`PASS: ${ast.invoke}`)
}

export const runTests = (code: string) => {
  const r = wastParser(code, 0)
  if (!r[0]) {
    throw new Error("failed to parse")
  }
  const testCases = r[1].filter(isAssertReturn)
  const modules = r[1].filter(isModule)

  const module = watModuleToWasmModule(modules[0])
  const vm = new WASMVirtualMachine(module)

  if (testCases.length === 0) {
    throw new Error("no test case")
  }

  for (const test of testCases) {
    runTestCase(vm, test)
  }
}
