import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"

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
      return (_, { callStack, values }, _pc, jump) => {
        // TODO: check result type
        const val = values.pop()
        const { returnAddress } = callStack.peek()
        callStack.pop()
        callStack.peek().values.push(val)
        jump(returnAddress)
      }
    case "call":
      return (_, { callStack, values }, pc) => {
        // TODO: check parameters
        const local = [values.peek()]
        const ctx = new WASMContext(local, pc)
        callStack.push(ctx)
      }
    case "call_indirect":
      return null
  }
  return null
}
