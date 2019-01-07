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
        values.push(local[code.parameters[0]])
      }
    case "set_local":
    case "local.set":
      return (code, { values, local }) => {
        local[code.parameters[0]] = values.pop()
      }
    case "tee_local":
    case "local.tee":
      return (code, { values, local }) => {
        local[code.parameters[0]] = values.peek()
      }
    case "get_global":
    case "global.get":
      return (code, { values, global }) => {
        values.push(global[code.parameters[0]])
      }
    case "set_global":
    case "global.set":
      return (code, { values, global }) => {
        global[code.parameters[0]] = values.pop()
      }
  }
  return null
}
