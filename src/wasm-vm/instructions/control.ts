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
      return (code, { callStack, values, functions }, pc, jump) => {
        const fn = functions.find(f => f.pointer === code.parameters[0])
        const local = []

        // TODO: check parameters
        fn.parameters.forEach(_ => local.push(values.pop()))

        // initialize local values
        fn.locals.forEach(_ => local.push(0))

        const ctx = new WASMContext(pc, local)
        callStack.push(ctx)

        jump(fn.pointer)
      }
    case "call_indirect":
      return null
  }
  return null
}
