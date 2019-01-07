import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"
import {
  countLeadingZeros,
  countTrailingZeros,
  popCount
} from "../../misc/number"

// https://webassembly.github.io/spec/core/syntax/instructions.html#numeric-instructions
export const numericInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opcode) {
    case "i32.const":
    case "i64.const":
    case "f32.const":
    case "f64.const":
      return (code, { values }) => {
        code.parameters.forEach(values.push)
      }
    case "i32.add":
    case "i64.add":
    case "f32.add":
    case "f64.add":
      return (_, { values }) => {
        values.push(values.pop() + values.pop())
      }
    case "i32.sub":
    case "i64.sub":
    case "f32.sub":
    case "f64.sub":
      return (_, { values }) => {
        values.push(-values.pop() + values.pop())
      }
    case "i32.mul":
    case "i64.mul":
    case "f32.mul":
    case "f64.mul":
      return (_, { values }) => {
        values.push(values.pop() * values.pop())
      }
    case "i32.div_s":
    case "i64.div_s":
    case "f32.div_s":
    case "f64.div_s":
    case "i32.div_u":
    case "i64.div_u":
    case "f32.div_u":
    case "f64.div_u":
      return (_, { values }) => {
        values.push(values.pop() / values.pop())
      }
    case "i32.rem_s":
    case "i64.rem_s":
    case "f32.rem_s":
    case "f64.rem_s":
    case "i32.rem_u":
    case "i64.rem_u":
    case "f32.rem_u":
    case "f64.rem_u":
      return (_, { values }) => {
        values.push(values.pop() % values.pop())
      }
    case "i32.and":
    case "i64.and":
    case "f32.and":
    case "f64.and":
      return (_, { values }) => {
        values.push(values.pop() & values.pop())
      }
    case "i32.or":
    case "i64.or":
    case "f32.or":
    case "f64.or":
      return (_, { values }) => {
        values.push(values.pop() | values.pop())
      }
    case "i32.xor":
    case "i64.xor":
    case "f32.xor":
    case "f64.xor":
      return (_, { values }) => {
        values.push(values.pop() ^ values.pop())
      }
    case "i32.shl":
    case "i64.shl":
    case "f32.shl":
    case "f64.shl":
      return (_, { values }) => {
        values.push(values.pop() << values.pop())
      }
    case "i32.shr_s":
    case "i64.shr_s":
    case "f32.shr_s":
    case "f64.shr_s":
    case "i32.shr_u":
    case "i64.shr_u":
    case "f32.shr_u":
    case "f64.shr_u":
      return (_, { values }) => {
        values.push(values.pop() >> values.pop())
      }
    case "i32.rot_l":
    case "i64.rot_l":
    case "f32.rot_l":
    case "f64.rot_l":
      throw new Error("not implemented")
    case "i32.rot_r":
    case "i64.rot_r":
    case "f32.rot_r":
    case "f64.rot_r":
      throw new Error("not implemented")
    case "i32.eq":
    case "i64.eq":
    case "f32.eq":
    case "f64.eq":
      return (_, { values }) => {
        values.push(values.pop() === values.pop() ? 1 : 0)
      }
    case "i32.ne":
    case "i64.ne":
    case "f32.ne":
    case "f64.ne":
      return (_, { values }) => {
        values.push(values.pop() === values.pop() ? 0 : 1)
      }
    case "i32.lt_s":
    case "i64.lt_s":
    case "f32.lt_s":
    case "f64.lt_s":
    case "i32.lt_u":
    case "i64.lt_u":
    case "f32.lt_u":
    case "f64.lt_u":
      return (_, { values }) => {
        values.push(values.pop() > values.pop() ? 1 : 0)
      }
    case "i32.le_s":
    case "i64.le_s":
    case "f32.le_s":
    case "f64.le_s":
    case "i32.le_u":
    case "i64.le_u":
    case "f32.le_u":
    case "f64.le_u":
      return (_, { values }) => {
        values.push(values.pop() >= values.pop() ? 1 : 0)
      }
    case "i32.gt_s":
    case "i64.gt_s":
    case "f32.gt_s":
    case "f64.gt_s":
    case "i32.gt_u":
    case "i64.gt_u":
    case "f32.gt_u":
    case "f64.gt_u":
      return (_, { values }) => {
        values.push(values.pop() < values.pop() ? 1 : 0)
      }
    case "i32.ge_s":
    case "i64.ge_s":
    case "f32.ge_s":
    case "f64.ge_s":
    case "i32.ge_u":
    case "i64.ge_u":
    case "f32.ge_u":
    case "f64.ge_u":
      return (_, { values }) => {
        values.push(values.pop() <= values.pop() ? 1 : 0)
      }
    case "i32.clz":
      return (_, { values }) => {
        values.push(countLeadingZeros(values.pop(), 32))
      }
    case "i64.clz":
      return (_, { values }) => {
        values.push(countLeadingZeros(values.pop(), 64))
      }
    case "i32.ctz":
      return (_, { values }) => {
        values.push(countTrailingZeros(values.pop(), 32))
      }
    case "i64.ctz":
      return (_, { values }) => {
        values.push(countTrailingZeros(values.pop(), 64))
      }
    case "i32.popcnt":
    case "i64.popcnt":
      return (_, { values }) => {
        return values.push(popCount(values.pop()))
      }
    case "i32.eqz":
    case "i64.eqz":
    case "f32.eqz":
    case "f64.eqz":
      return (_, { values }) => {
        values.push(values.pop() === 0 ? 1 : 0)
      }
    case "f32.abs":
    case "f64.abs":
      return (_, { values }) => {
        values.push(Math.abs(values.pop()))
      }
    case "f32.neg":
    case "f64.neg":
      return (_, { values }) => {
        values.push(-values.pop())
      }
    case "f32.copysign":
    case "f64.copysign":
      throw new Error("not implemented")
    case "f32.ceil":
    case "f64.ceil":
      return (_, { values }) => {
        values.push(Math.ceil(values.pop()))
      }
    case "f32.floor":
    case "f64.floor":
      return (_, { values }) => {
        values.push(Math.floor(values.pop()))
      }
    case "f32.trunc":
    case "f64.trunc":
      throw new Error("not implemented")
    case "f32.nearest":
    case "f64.nearest":
      throw new Error("not implemented")
    case "f32.sqrt":
    case "f64.sqrt":
      return (_, { values }) => {
        values.push(Math.sqrt(values.pop()))
      }
    case "f32.min":
    case "f64.min":
      return (_, { values }) => {
        values.push(Math.min(values.pop(), values.pop()))
      }
    case "f32.max":
    case "f64.max":
      return (_, { values }) => {
        values.push(Math.max(values.pop(), values.pop()))
      }
    case "i32.wrap/i64":
    case "i32.trunc_s/f32":
    case "i32.trunc_s/f64":
    case "i32.trunc_u/f32":
    case "i32.trunc_u/f64":
    case "i32.reinterpret/f32":
    case "i64.extend_s/i32":
    case "i64.extend_u/i32":
    case "i64.trunc_s/f32":
    case "i64.trunc_s/f64":
    case "i64.trunc_u/f32":
    case "i64.trunc_u/f64":
    case "i64.reinterpret/f64":
    case "f32.demote/f64":
    case "f32.convert_s/i32":
    case "f32.convert_s/i64":
    case "f32.convert_u/i32":
    case "f32.convert_u/i64":
    case "f32.reinterpret/i32":
    case "f64.promote/f32":
    case "f64.convert_s/i32":
    case "f64.convert_s/i64":
    case "f64.convert_u/i32":
    case "f64.convert_u/i64":
    case "f64.reinterpret/i64":
      throw new Error("not implemented")
  }
  return null
}
