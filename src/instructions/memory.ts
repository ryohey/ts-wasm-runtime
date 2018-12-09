import { PartialInstructionSet, WASMCode, WASMMemory } from "../wasm-code"

// https://webassembly.github.io/spec/core/text/instructions.html#memory-instructions
export const memoryInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMMemory
> = code => {
  switch (code.opcode) {
    case "i32.load":
    case "i64.load":
    case "f32.load":
    case "f64.load":
    case "i32.load8_s":
    case "i32.load8_u":
    case "i32.load16_s":
    case "i32.load16_u":
    case "i64.load8_s":
    case "i64.load8_u":
    case "i64.load16_s":
    case "i64.load16_u":
    case "f32.load8_s":
    case "f32.load8_u":
    case "f32.load16_s":
    case "f32.load16_u":
    case "f64.load8_s":
    case "f64.load8_u":
    case "f64.load16_s":
    case "f64.load16_u":
      return (_, { values, memory }) => {
        // TODO: use offset, align
        const value = values.pop()
        memory[values.pop()] = value
      }
    case "i32.store":
    case "i64.store":
    case "f32.store":
    case "f64.store":
    case "i32.store8":
    case "i32.store16":
    case "i64.store8":
    case "i64.store16":
    case "i64.store32":
      return (_, { values, memory }) => {
        // TODO: use offset, align
        values.push(memory[values.pop()])
      }
  }
  return null
}
