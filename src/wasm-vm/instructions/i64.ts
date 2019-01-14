import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"

// https://webassembly.github.io/spec/core/syntax/instructions.html#numeric-instructions
export const i64InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    case "i64.const":
    case "i64.add":
    case "i64.sub":
    case "i64.mul":
    case "i64.div_s":
    case "i64.div_u":
    case "i64.rem_s":
    case "i64.rem_u":
    case "i64.and":
    case "i64.or":
    case "i64.xor":
    case "i64.shl":
    case "i64.shr_s":
    case "i64.shr_u":
    case "i64.rot_l":
    case "i64.rot_r":
    case "i64.eq":
    case "i64.ne":
    case "i64.lt_s":
    case "i64.lt_u":
    case "i64.le_s":
    case "i64.le_u":
    case "i64.gt_s":
    case "i64.gt_u":
    case "i64.ge_s":
    case "i64.ge_u":
    case "i64.clz":
    case "i64.ctz":
    case "i64.popcnt":
    case "i64.eqz":
    case "i64.extend_s/i32":
    case "i64.extend_u/i32":
    case "i64.trunc_s/f32":
    case "i64.trunc_s/f64":
    case "i64.trunc_u/f32":
    case "i64.trunc_u/f64":
    case "i64.reinterpret/f64":
      throw new Error(`not implemented ${code.opcode}`)
  }
  return null
}
