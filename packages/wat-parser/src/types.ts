import { or, map, seq } from "@ryohey/fn-parser"
import {
  ValType,
  Float64Value,
  Float32Value,
  Int32Value,
  Int64Value
} from "@ryohey/wasm-ast"
import { regexp, keyword, match } from "./utils"
import { float, Float } from "./float"

const int = regexp(/^(-?[0-9]+)$/)
const hex = regexp(/^(-?0x[0-9a-fA-F][0-9a-fA-F_]*)$/)

const stringToInt32 = (str: string): Int32Value => {
  throw new Error("")
}

const hexStringToInt32 = (str: string): Int32Value => {
  throw new Error("")
}

const stringToInt64 = (str: string): Int64Value => {
  throw new Error("")
}

const hexStringToInt64 = (str: string): Int64Value => {
  throw new Error("")
}

const convertToFloat32 = (value: Float): Float32Value => {
  throw new Error("")
}

const convertToFloat64 = (value: Float): Float64Value => {
  throw new Error("")
}

export const int32 = or(map(int, stringToInt32), map(hex, hexStringToInt32))
export const int64 = or(map(int, stringToInt64), map(hex, hexStringToInt64))

export const float32 = map(match(float), convertToFloat32)
export const float64 = map(match(float), convertToFloat64)

export const identifier = regexp(
  /^(\$[a-zA-Z_][a-zA-Z0-9_.+-\\*/\\^~=<>!?@#$%&|:'`]*)$/
)
export const name = regexp(/^([a-zA-Z]+)$/)
export const string = regexp(/^\"(.+)\"/)

export const num = map(int, r => parseInt(r, 10))
export const indices = or(num, identifier)

export const valType = or(
  keyword(ValType.i32),
  keyword(ValType.i64),
  keyword(ValType.f32),
  keyword(ValType.f64)
)

export const blockType = map(seq(keyword("result"), valType), r => r[1])
