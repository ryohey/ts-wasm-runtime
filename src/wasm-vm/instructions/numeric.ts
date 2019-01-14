import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory,
  WASMMemoryValue,
  WASMMemory
} from "../wasm-code"
import { Int32Value } from "../../wat-parser/types"
import { Int32 } from "../../number/Int32"

const monop = <T extends WASMMemoryValue>(fn: (a: T) => T) => (
  _: WASMCode,
  memory: WASMMemory
) => {
  const { values } = memory
  const a = values.pop() as T
  values.push(fn(a))
}

const boolToInt = <T extends WASMMemoryValue>(fn: (a: T, b: T) => boolean) => (
  a: T,
  b: T
) => Int32.bool(fn(a, b))

const binop = <T extends WASMMemoryValue>(fn: (a: T, b: T) => T) => (
  _: WASMCode,
  memory: WASMMemory
) => {
  const { values } = memory
  const a = values.pop() as T
  const b = values.pop() as T
  values.push(fn(b, a))
}

const boolBinop = <T extends WASMMemoryValue>(fn: (a: T, b: T) => boolean) =>
  binop(boolToInt(fn))

// https://webassembly.github.io/spec/core/syntax/instructions.html#numeric-instructions
export const numericInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    // i32

    case "i32.const":
      return (code, { values }) => {
        const a = code.parameters[0] as Int32Value
        values.push(Int32.int(a))
      }
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
      throw new Error(`not implemented ${code.opcode}`)
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
      return monop(a => Int32.bool(Int32.isZero(a)))

    case "i32.wrap/i64":
    case "i32.trunc_s/f32":
    case "i32.trunc_s/f64":
    case "i32.trunc_u/f32":
    case "i32.trunc_u/f64":
    case "i32.reinterpret/f32":
      throw new Error(`not implemented ${code.opcode}`)

    // i64

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

    // f32

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

    // f64

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
