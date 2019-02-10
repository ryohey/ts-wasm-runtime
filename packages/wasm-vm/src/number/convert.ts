import { WASMMemoryValue } from "../wasm-memory"
import { Int32 } from "./Int32"
import { Int64 } from "./Int64"
import { Float64 } from "./Float64"
import { Float32 } from "./Float32"
import { ValType, NumberValue } from "@ryohey/wasm-ast"

export const convertNumber = (num: NumberValue): WASMMemoryValue => {
  if ("i32" in num) {
    return Int32.obj(num)
  }
  if ("i64" in num) {
    return Int64.obj(num)
  }
  if ("f32" in num) {
    return Float32.obj(num)
  }
  if ("f64" in num) {
    return Float64.obj(num)
  }
  throw new Error("not supported number type")
}

export const numberValue = (type: ValType, value: string): NumberValue => {
  switch (type) {
    case ValType.i32:
      return { [type]: value }
    case ValType.i64:
      return { [type]: value }
    case ValType.f32:
      return { [type]: value }
    case ValType.f64:
      return { [type]: value }
  }
}
