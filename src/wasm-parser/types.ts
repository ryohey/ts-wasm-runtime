import { byte } from "./utils"
import { or, map } from "../parser/parser"
import { ValType } from "../ast/number"

export type Bytes = number[]
export type Byte = Bytes[0]

export const valType = or(
  map(byte(0x7f), _ => ValType.i32),
  map(byte(0x7e), _ => ValType.i64),
  map(byte(0x7d), _ => ValType.f32),
  map(byte(0x7c), _ => ValType.f64)
)
