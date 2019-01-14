import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"

export const f64InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    case "f64.const":
    case "f64.add":
    case "f64.sub":
    case "f64.mul":
    case "f64.div":
    case "f64.eq":
    case "f64.ne":
    case "f64.lt":
    case "f64.le":
    case "f64.gt":
    case "f64.ge":
    case "f64.abs":
    case "f64.neg":
    case "f64.copysign":
    case "f64.ceil":
    case "f64.floor":
    case "f64.trunc":
    case "f64.nearest":
    case "f64.sqrt":
    case "f64.min":
    case "f64.max":
    case "f64.promote/f32":
    case "f64.convert_s/i32":
    case "f64.convert_s/i64":
    case "f64.convert_u/i32":
    case "f64.convert_u/i64":
    case "f64.reinterpret/i64":
      throw new Error(`not implemented ${code.opcode}`)
  }
  return null
}
