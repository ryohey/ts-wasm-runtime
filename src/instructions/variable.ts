import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"

// https://webassembly.github.io/spec/core/text/instructions.html#variable-instructions
export const variableInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    case "get_local":
      return (code, { values, local }) => {
        values.push(local[code.value])
      }
    case "set_local":
      return (code, { values, local }) => {
        local[code.value] = values.peek()
      }
    case "tee_local":
      // TODO:
      return null
    case "global.get":
      return (code, { values, global }) => {
        values.push(global[code.value])
      }
    case "global.set":
      return (code, { values, global }) => {
        global[code.value] = values.peek()
      }
  }
  return null
}
