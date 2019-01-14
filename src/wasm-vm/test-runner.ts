import * as assert from "assert"
import { wastParser } from "../wat-parser/wast"
import { ASTModuleNode, Int32Value, NumberValue } from "../wat-parser/types"
import { ASTModule } from "../wat-parser/module"
import { ASTAssertReturn } from "../wat-parser/assert"
import { WASMVirtualMachine } from "./wasm-vm"
import { compile } from "../compiler/compiler"
import { Int32 } from "../number/Int32"
import { convertNumber } from "../number/convert"

const isAssertReturn = (n: ASTModuleNode): n is ASTAssertReturn =>
  n.nodeType === "assert_return"

const isModule = (n: ASTModuleNode): n is ASTModule => n.nodeType === "module"

const runTestCase = (vm: WASMVirtualMachine, ast: ASTAssertReturn) => {
  console.log(`Testing ${ast.invoke}...`)
  const received = vm.callFunction(
    ast.invoke,
    ...ast.args.map(a => a.parameters[0] as Int32Value)
  )
  for (const exp of ast.expected) {
    for (let i = 0; i < received.length; i++) {
      const receivedValue = convertNumber(received[i]).toObject()
      const expectedValue = convertNumber(exp.parameters[
        i
      ] as NumberValue).toObject()
      const debugName = `${ast.invoke}(${ast.args
        .map(a => JSON.stringify(a.parameters[0]))
        .join(", ")})`
      assert.deepStrictEqual(
        receivedValue,
        expectedValue,
        `${debugName}: expected ${JSON.stringify(
          exp.parameters[i]
        )}. but received ${JSON.stringify(received[i])}`
      )
    }
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

  for (const test of testCases) {
    runTestCase(vm, test)
  }
}
