import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"

export const f32InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    case "f32.const":
    case "f32.add":
    case "f32.sub":
    case "f32.mul":
    case "f32.div":
    case "f32.eq":
    case "f32.ne":
    case "f32.lt":
    case "f32.le":
    case "f32.gt":
    case "f32.ge":
    case "f32.abs":
    case "f32.neg":
    case "f32.copysign":
    case "f32.ceil":
    case "f32.floor":
    case "f32.trunc":
    case "f32.nearest":
    case "f32.sqrt":
    case "f32.min":
    case "f32.max":
    case "f32.demote/f64":
    case "f32.convert_s/i32":
    case "f32.convert_s/i64":
    case "f32.convert_u/i32":
    case "f32.convert_u/i64":
    case "f32.reinterpret/i32":
  }
  return null
}
