import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory
} from "../wasm-memory"

// https://webassembly.github.io/spec/core/text/instructions.html#variable-instructions
export const variableInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "drop":
      return ({ values }) => {
        values.pop()
      }
    case "get_local":
    case "local.get":
      return ({ values, local }) => {
        const idx = code.parameter as number
        values.push(local[idx])
      }
    case "set_local":
    case "local.set":
      return ({ values, local }) => {
        const idx = code.parameter as number
        local[idx] = values.pop()
      }
    case "tee_local":
    case "local.tee":
      return ({ values, local }) => {
        const idx = code.parameter as number
        local[idx] = values.peek()
      }
    case "get_global":
    case "global.get":
      return ({ values, global }) => {
        const idx = code.parameter as number
        values.push(global[idx])
      }
    case "set_global":
    case "global.set":
      return ({ values, global }) => {
        const idx = code.parameter as number
        global[idx] = values.pop()
      }
  }
  return null
}
