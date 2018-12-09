import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { Stack } from "../stack"

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
      return (_, { stack, values }) => {
        // TODO: check result type
        const val = values.pop()
        stack.pop()
        stack.peek().values.push(val)
      }
    case "call":
      return (_, { stack, values }) => {
        // TODO: check parameters
        const ctx = new WASMContext()
        ctx.local.push(values.peek())
        stack.push(ctx)
      }
    case "call_indirect":
      return null
  }
  return null
}
