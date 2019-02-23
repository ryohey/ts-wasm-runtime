import { or, map, seq } from "@ryohey/fn-parser"
import {
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value,
  ValType
} from "@ryohey/wasm-ast"
import { regexp, keyword } from "./utils"

const int = regexp(/^(-?[0-9]+)$/)
const hex = regexp(/^(-?0x[0-9a-fA-F][0-9a-fA-F_]*)$/)

export const int32 = or(
  map(int, r => ({ i32: r } as Int32Value)),
  map(hex, r => ({ i32: r, isHex: true } as Int32Value))
)
export const int64 = or(
  map(int, r => ({ i64: r } as Int64Value)),
  map(hex, r => ({ i64: r, isHex: true } as Int64Value))
)

export const float = regexp(/^(-?[0-9\.]+)$/)
export const hexFloat = regexp(/^(-?0x[0-9a-fA-F]\.?[0-9a-fA-F_]*)$/)

export const float32 = or(
  map(float, r => ({ f32: r } as Float32Value)),
  map(hexFloat, r => ({ f32: r, isHex: true } as Float32Value))
)
export const float64 = or(
  map(float, r => ({ f64: r } as Float64Value)),
  map(hexFloat, r => ({ f64: r, isHex: true } as Float64Value))
)

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
