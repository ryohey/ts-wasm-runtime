import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"

// https://webassembly.github.io/spec/core/text/instructions.html#memory-instructions
export const memoryInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
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
      throw new Error("not implemented")
    case "i32.store":
    case "i64.store":
    case "f32.store":
    case "f64.store":
    case "i32.store8":
    case "i32.store16":
    case "i64.store8":
    case "i64.store16":
    case "i64.store32":
      throw new Error("not implemented")
  }
  return null
}
