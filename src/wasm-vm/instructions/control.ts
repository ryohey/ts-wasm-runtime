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
      return () => {
        // do nothing
        // the compiler use _pop and _ret
      }
    case "call":
      return (code, { functions, values }, pc, jump) => {
        const fn = functions.find(f => f.pointer === code.parameters[0])
        // add the return address to stack
        values.push(pc)
        jump(fn.pointer)
      }
    case "call_indirect":
      return null
  }
  return null
}
