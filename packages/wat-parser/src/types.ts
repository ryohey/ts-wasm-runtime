import { or, map, seq } from "@ryohey/fn-parser"
import { ValType, Int32Value, Int64Value } from "@ryohey/wasm-ast"
import { regexp, keyword, match } from "./utils"
import { float } from "./float"

const intOrHex = or(
  regexp(/^(-?[0-9]+)$/),
  regexp(/^(-?0x[0-9a-fA-F][0-9a-fA-F_]*)$/)
)

export const int32 = map(intOrHex, r => ({ i32: parseInt(r) } as Int32Value))
export const int64 = map(intOrHex, r => ({ i64: BigInt(r) } as Int64Value))
export const float32 = map(match(float), r => ({ f32: r }))
export const float64 = map(match(float), r => ({ f64: r }))

export const identifier = regexp(
  /^(\$[a-zA-Z_][a-zA-Z0-9_.+-\\*/\\^~=<>!?@#$%&|:'`]*)$/
)
export const name = regexp(/^([a-zA-Z]+)$/)
export const string = regexp(/^\"(.+)\"/)

export const num = map(intOrHex, parseInt)
export const indices = or(num, identifier)

export const valType = or(
  keyword(ValType.i32),
  keyword(ValType.i64),
  keyword(ValType.f32),
  keyword(ValType.f64)
)

export const blockType = map(seq(keyword("result"), valType), r => r[1])
