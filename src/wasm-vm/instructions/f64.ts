import { PartialInstructionSet, WASMCode, WASMLocalMemory } from "../wasm-code"
import { binop, monop, boolBinop } from "./helpers"
import { Float64 } from "../../number/Float64"
import { Float64Value } from "../../wat-parser/types"

export const f64InstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "f64.const":
      return (code, { values }) => {
        const a = code.parameters[0] as Float64Value
        values.push(Float64.obj(a))
      }
    case "f64.add":
      return binop(Float64.add)
    case "f64.sub":
      return binop(Float64.sub)
    case "f64.mul":
      return binop(Float64.mul)
    case "f64.div":
      return binop(Float64.div)
    case "f64.eq":
      return boolBinop(Float64.equal)
    case "f64.ne":
      return boolBinop(Float64.notEqual)
    case "f64.lt":
      return boolBinop(Float64.lessThan)
    case "f64.le":
      return boolBinop(Float64.lessThanOrEqual)
    case "f64.gt":
      return boolBinop(Float64.greaterThan)
    case "f64.ge":
      return boolBinop(Float64.greaterThanOrEqual)
    case "f64.abs":
      return monop(Float64.abs)
    case "f64.neg":
      return monop(Float64.neg)
    case "f64.copysign":
      throw new Error(`not implemented ${code.opType}`)
    case "f64.ceil":
      return monop(Float64.ceil)
    case "f64.floor":
      return monop(Float64.floor)
    case "f64.trunc":
      return monop(Float64.trunc)
    case "f64.nearest":
      return monop(Float64.nearest)
    case "f64.sqrt":
      return monop(Float64.sqrt)
    case "f64.min":
      return binop(Float64.min)
    case "f64.max":
      return binop(Float64.max)

    case "f64.promote/f32":
    case "f64.convert_s/i32":
    case "f64.convert_s/i64":
    case "f64.convert_u/i32":
    case "f64.convert_u/i64":
    case "f64.reinterpret/i64":
      throw new Error(`not implemented ${code.opType}`)
  }
  return null
}
