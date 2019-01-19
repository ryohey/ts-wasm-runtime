import * as assert from "assert"
import { wastParser } from "../wat-parser/wast"
import { ASTModule } from "../wat-parser/module"
import { ASTAssertReturn } from "../wat-parser/assert"
import { WASMVirtualMachine } from "./wasm-vm"
import { compile } from "../compiler/compiler"
import { convertNumber } from "../number/convert"

type ASTTopNode = ASTModule | ASTAssertReturn

const isAssertReturn = (n: ASTTopNode): n is ASTAssertReturn =>
  n.nodeType === "assert_return"

const isModule = (n: ASTTopNode): n is ASTModule => n.nodeType === "module"

const runTestCase = (vm: WASMVirtualMachine, ast: ASTAssertReturn) => {
  console.log(`Testing ${ast.invoke}...`)
  const received = vm.callFunction(
    ast.invoke,
    ...ast.args.map(a => a.parameter)
  )
  for (let i = 0; i < received.length; i++) {
    const exp = ast.expected[i]
    const receivedValue = convertNumber(received[i]).toObject()
    const expectedValue = convertNumber(exp.parameter).toObject()
    const debugName = `${ast.invoke}(${ast.args
      .map(a => JSON.stringify(a.parameter))
      .join(", ")})`
    assert.deepStrictEqual(
      receivedValue,
      expectedValue,
      `${debugName}: expected ${JSON.stringify(
        exp.parameter
      )}. but received ${JSON.stringify(received[i])}`
    )
  }
  console.log(`PASS: ${ast.invoke}`)
}

export const runTests = (code: string) => {
  const r = wastParser(code, 0)
  if (!r[0]) {
    throw new Error("failed to parse")
  }
  const testCases = r[1].filter(isAssertReturn)
  const modules = r[1].filter(isModule)

  const module = compile(modules[0])
  const vm = new WASMVirtualMachine(module)

  if (testCases.length === 0) {
    throw new Error("no test case")
  }

  for (const test of testCases) {
    runTestCase(vm, test)
  }
}
