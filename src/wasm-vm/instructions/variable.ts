import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"

// https://webassembly.github.io/spec/core/text/instructions.html#variable-instructions
export const variableInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    case "drop":
      return (_, { values }) => {
        values.pop()
      }
    case "get_local":
    case "local.get":
      return (code, { values, local }) => {
        const idx = code.parameters[0] as number
        values.push(local[idx])
      }
    case "set_local":
    case "local.set":
      return (code, { values, local }) => {
        const idx = code.parameters[0] as number
        local[idx] = values.pop()
      }
    case "tee_local":
    case "local.tee":
      return (code, { values, local }) => {
        const idx = code.parameters[0] as number
        local[idx] = values.peek()
      }
    case "get_global":
    case "global.get":
      return (code, { values, global }) => {
        const idx = code.parameters[0] as number
        values.push(global[idx])
      }
    case "set_global":
    case "global.set":
      return (code, { values, global }) => {
        const idx = code.parameters[0] as number
        global[idx] = values.pop()
      }
  }
  return null
}
