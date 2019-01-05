import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { range } from "../../misc/array"

export const controlInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMMemory
> = code => {
  switch (code.opcode) {
    case "nop":
      return () => {}
    case "unreachable":
      return null
    case "block":
      return null
    case "loop":
      return null
    case "if":
      return null
    case "br":
      return null
    case "br_if":
      return null
    case "br_table":
      return null
    case "return":
      return () => {
        // do nothing
        // the compiler use _pop and _ret
      }
    case "call":
      return (code, memory) => {
        const { functions, values, callStack } = memory
        const fn = functions.find(f => f.pointer === code.parameters[0])

        // 指定された数のパラメータを values から pop して新しいスタックに積む
        const locals = range(0, code.parameters[0]).map(_ => values.pop())

        const ctx = new WASMContext(fn.pointer, locals, fn.results.length)
        callStack.push(ctx)
      }
    case "call_indirect":
      return null
  }
  return null
}
