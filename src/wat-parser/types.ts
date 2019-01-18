import { or, map, seq } from "../parser/parser"
import {
  regexp,
  keyword,
  is,
  isIntElement,
  isHexElement,
  isFloatElement
} from "./utils"

export interface Int32Value {
  i32: string
  isHex?: boolean
}
export interface Int64Value {
  i64: string
  isHex?: boolean
}
export interface Float32Value {
  f32: string
}
export interface Float64Value {
  f64: string
}
export type NumberValue = Int32Value | Int64Value | Float32Value | Float64Value

export const int32 = or(
  map(is(isIntElement), r => ({ i32: r.int } as Int32Value)),
  map(is(isHexElement), r => ({ i32: r.hex, isHex: true } as Int32Value))
)
export const int64 = or(
  map(is(isIntElement), r => ({ i64: r.int } as Int64Value)),
  map(is(isHexElement), r => ({ i64: r.hex, isHex: true } as Int64Value))
)
export const float32 = or(
  map(is(isFloatElement), r => ({ f32: r.float } as Float32Value)),
  map(is(isIntElement), r => ({ f32: r.int } as Float32Value))
)
export const float64 = or(
  map(is(isFloatElement), r => ({ f64: r.float } as Float64Value)),
  map(is(isIntElement), r => ({ f64: r.int } as Float64Value))
)

export const identifier = regexp(
  /^(\$[a-zA-Z_][a-zA-Z0-9_.+-\\*/\\^~=<>!?@#$%&|:'`]*)$/
)
export const name = regexp(/^([a-zA-Z]+)$/)
export const string = regexp(/^\"(.+)\"/)

export const num = map(is(isIntElement), v => parseInt(v.int))
export const indices = or(num, identifier)

export enum ValType {
  i32 = "i32",
  i64 = "i64",
  f32 = "f32",
  f64 = "f64"
}

export const valType = or(
  keyword(ValType.i32),
  keyword(ValType.i64),
  keyword(ValType.f32),
  keyword(ValType.f64)
)

export const blockType = map(seq(keyword("result"), valType), r => r[1])
