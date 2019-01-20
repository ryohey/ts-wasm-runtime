import { WASMModule } from "../wasm-vm/wasm-memory"
import { Int32 } from "../number/Int32"
import { replaceIdentifiers } from "./precompile"
import { ASTModule } from "../ast/module"

// Compiles AST generated by wat-parser.ts into machine code for wasm-vm.ts.
export const compile = (ast: ASTModule): WASMModule => {
  ast = replaceIdentifiers(ast)

  // TODO: functions, table 以外を実装

  const table: { [key: number]: number } = {}
  ast.elems.forEach(e => {
    const offset = Int32.obj(e.offset).toNumber()
    e.funcIds.forEach((id, i) => {
      table[offset + i] = id as number
    })
  })

  return {
    functions: ast.functions,
    table
  }
}
