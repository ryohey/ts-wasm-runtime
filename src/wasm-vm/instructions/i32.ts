import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory
} from "../wasm-memory"
import { Int32 } from "../../number/Int32"
import { binop, monop, boolBinop, boolMonop } from "./helpers"

// https://webassembly.github.io/spec/core/syntax/instructions.html#numeric-instructions
export const i32InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "i32.const":
      return ({ values }) => values.push(Int32.obj(code.parameter))
    case "i32.add":
      return binop(Int32.add)
    case "i32.sub":
      return binop(Int32.sub)
    case "i32.mul":
      return binop(Int32.mul)
    case "i32.and":
      return binop(Int32.and)
    case "i32.or":
      return binop(Int32.or)
    case "i32.xor":
      return binop(Int32.xor)
    case "i32.eq":
      return boolBinop(Int32.equal)
    case "i32.ne":
      return boolBinop(Int32.notEqual)
    case "i32.rem_s":
      return binop(Int32.rem_s)
    case "i32.rem_u":
      return binop(Int32.rem_u)
    case "i32.div_s":
      return binop(Int32.div_s)
    case "i32.div_u":
      return binop(Int32.div_u)
    case "i32.shl":
      return binop(Int32.shiftLeft)
    case "i32.shr_u":
      return binop(Int32.shiftRight_u)
    case "i32.shr_s":
      return binop(Int32.shiftRight_s)
    case "i32.rot_l":
    case "i32.rot_r":
      throw new Error(`not implemented ${code.opType}`)
    case "i32.lt_s":
      return boolBinop(Int32.lessThan_s)
    case "i32.lt_u":
      return boolBinop(Int32.lessThan_u)
    case "i32.le_s":
      return boolBinop(Int32.lessThanOrEqual_s)
    case "i32.le_u":
      return boolBinop(Int32.lessThanOrEqual_u)
    case "i32.gt_s":
      return boolBinop(Int32.greaterThan_s)
    case "i32.gt_u":
      return boolBinop(Int32.greaterThan_u)
    case "i32.ge_s":
      return boolBinop(Int32.greaterThanOrEqual_s)
    case "i32.ge_u":
      return boolBinop(Int32.greaterThanOrEqual_u)
    case "i32.clz":
      return monop(Int32.clz)
    case "i32.ctz":
      return monop(Int32.ctz)
    case "i32.popcnt":
      return monop(Int32.popcnt)
    case "i32.eqz":
      return boolMonop(Int32.isZero)

    case "i32.wrap/i64":
    case "i32.trunc_s/f32":
    case "i32.trunc_s/f64":
    case "i32.trunc_u/f32":
    case "i32.trunc_u/f64":
    case "i32.reinterpret/f32":
      throw new Error(`not implemented ${code.opType}`)
  }
  return null
}
