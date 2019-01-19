import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory
} from "../wasm-memory"
import { Float32Value } from "../../wat-parser/types"
import { Float32 } from "../../number/Float32"
import { binop, boolMonop, boolBinop, monop } from "./helpers"

export const f32InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "f32.const":
      return (code, { values }) => {
        const a = code.parameters[0] as Float32Value
        values.push(Float32.obj(a))
      }
    case "f32.add":
      return binop(Float32.add)
    case "f32.sub":
      return binop(Float32.sub)
    case "f32.mul":
      return binop(Float32.mul)
    case "f32.div":
      return binop(Float32.div)
    case "f32.eq":
      return boolBinop(Float32.equal)
    case "f32.ne":
      return boolBinop(Float32.notEqual)
    case "f32.lt":
      return boolBinop(Float32.lessThan)
    case "f32.le":
      return boolBinop(Float32.lessThanOrEqual)
    case "f32.gt":
      return boolBinop(Float32.greaterThan)
    case "f32.ge":
      return boolBinop(Float32.greaterThanOrEqual)
    case "f32.abs":
      return monop(Float32.abs)
    case "f32.neg":
      return monop(Float32.neg)
    case "f32.copysign":
      throw new Error(`not implemented ${code.opType}`)
    case "f32.ceil":
      return monop(Float32.ceil)
    case "f32.floor":
      return monop(Float32.floor)
    case "f32.trunc":
      return monop(Float32.trunc)
    case "f32.nearest":
      return monop(Float32.nearest)
    case "f32.sqrt":
      return monop(Float32.sqrt)
    case "f32.min":
      return binop(Float32.min)
    case "f32.max":
      return binop(Float32.max)
    case "f32.demote/f64":
    case "f32.convert_s/i32":
    case "f32.convert_s/i64":
    case "f32.convert_u/i32":
    case "f32.convert_u/i64":
    case "f32.reinterpret/i32":
      throw new Error(`not implemented ${code.opType}`)
  }
  return null
}
