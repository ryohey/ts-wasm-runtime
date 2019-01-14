import * as assert from "assert"
import { wastParser } from "../wat-parser/wast"
import { ASTModuleNode, Int32Value } from "../wat-parser/types"
import { ASTModule } from "../wat-parser/module"
import { ASTAssertReturn } from "../wat-parser/assert"
import { WASMVirtualMachine } from "./wasm-vm"
import { compile } from "../compiler/compiler"
import { Int32 } from "../number/Int32"

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
      assert(
        Int32.equal(
          Int32.int(received[i]),
          Int32.int(exp.parameters[i] as Int32Value)
        ),
        `${ast.invoke}(${ast.args
          .map(a => JSON.stringify(a.parameters[0]))
          .join(", ")}): expected ${JSON.stringify(exp.parameters[
          i
        ] as Int32Value)}. but received ${JSON.stringify(received[i])}`
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
