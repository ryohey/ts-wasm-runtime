import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory
} from "../wasm-memory"
import { Int64 } from "../number"
import { binop, boolBinop, boolMonop, monop } from "./helpers"

// https://webassembly.github.io/spec/core/syntax/instructions.html#numeric-instructions
export const i64InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "i64.const":
      return ({ values }) => values.push(Int64.obj(code.parameter))
    case "i64.add":
      return binop(Int64.add)
    case "i64.sub":
      return binop(Int64.sub)
    case "i64.mul":
      return binop(Int64.mul)
    case "i64.and":
      return binop(Int64.and)
    case "i64.or":
      return binop(Int64.or)
    case "i64.xor":
      return binop(Int64.xor)
    case "i64.eq":
      return boolBinop(Int64.equal)
    case "i64.ne":
      return boolBinop(Int64.notEqual)
    case "i64.rem_s":
      return binop(Int64.rem_s)
    case "i64.rem_u":
      return binop(Int64.rem_u)
    case "i64.div_s":
      return binop(Int64.div_s)
    case "i64.div_u":
      return binop(Int64.div_u)
    case "i64.shl":
      return binop(Int64.shiftLeft)
    case "i64.shr_u":
      return binop(Int64.shiftRight_u)
    case "i64.shr_s":
      return binop(Int64.shiftRight_s)
    case "i64.rotl":
    case "i64.rotr":
      throw new Error(`not implemented ${code.opType}`)
    case "i64.lt_s":
      return boolBinop(Int64.lessThan_s)
    case "i64.lt_u":
      return boolBinop(Int64.lessThan_u)
    case "i64.le_s":
      return boolBinop(Int64.lessThanOrEqual_s)
    case "i64.le_u":
      return boolBinop(Int64.lessThanOrEqual_u)
    case "i64.gt_s":
      return boolBinop(Int64.greaterThan_s)
    case "i64.gt_u":
      return boolBinop(Int64.greaterThan_u)
    case "i64.ge_s":
      return boolBinop(Int64.greaterThanOrEqual_s)
    case "i64.ge_u":
      return boolBinop(Int64.greaterThanOrEqual_u)
    case "i64.clz":
      return monop(Int64.clz)
    case "i64.ctz":
      return monop(Int64.ctz)
    case "i64.popcnt":
      return monop(Int64.popcnt)
    case "i64.eqz":
      return boolMonop(Int64.isZero)

    case "i64.extend_i32_s":
    case "i64.extend_i32_u":
    case "i64.trunc_f32_s":
    case "i64.trunc_f64_s":
    case "i64.trunc_f32_u":
    case "i64.trunc_f64_u":
    case "i64.reinterpret/f64":
      throw new Error(`not implemented ${code.opType}`)
  }
  return null
}
