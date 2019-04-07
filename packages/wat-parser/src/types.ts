import { or, map, seq } from "@ryohey/fn-parser"
import { ValType } from "@ryohey/wasm-ast"
import { regexp, keyword, match } from "./utils"
import { hexFloatNum, floatNum, FloatingValue, nan, inf, hexNan } from "./float"

const int = regexp(/^(-?[0-9]+)$/)
const hex = regexp(/^(-?0x[0-9a-fA-F][0-9a-fA-F_]*)$/)

export interface Int32String {
  i32: string
  isHex?: boolean
}

export interface Int64String {
  i64: string
  isHex?: boolean
}

export interface Float32String {
  f32: string
  exponent?: string
  isHex?: boolean

  // nan
  payload?: string
  isNegative?: boolean
}

export interface Float64String {
  f64: string
  exponent?: string
  isHex?: boolean

  // nan
  payload?: string
  isNegative?: boolean
}

export const int32 = or(
  map(int, r => ({ i32: r } as Int32String)),
  map(hex, r => ({ i32: r, isHex: true } as Int32String))
)
export const int64 = or(
  map(int, r => ({ i64: r } as Int64String)),
  map(hex, r => ({ i64: r, isHex: true } as Int64String))
)

const pickValue = <T>(obj: T, key: keyof T) => {
  if (key in obj) {
    return { [key]: obj[key] }
  }
  return {}
}

export const float32 = or(
  map(
    match(hexFloatNum),
    r =>
      ({
        ...pickValue(r, "exponent"),
        f32: r.fraction,
        isHex: true
      } as Float32String)
  ),
  map(
    match(floatNum),
    r => ({ ...pickValue(r, "exponent"), f32: r.fraction } as Float32String)
  ),
  map(match(hexNan), r => ({
    ...pickValue(r, "isNegative"),
    f32: "nan",
    payload: r.nan
  })),
  map(match(nan), r => ({
    ...pickValue(r, "isNegative"),
    f32: "nan"
  })),
  map(match(inf), r => ({ f32: r }))
)

export const float64 = or(
  map(
    match(hexFloatNum),
    r =>
      ({
        ...pickValue(r, "exponent"),
        f64: r.fraction,
        isHex: true
      } as Float64String)
  ),
  map(
    match(floatNum),
    r => ({ ...pickValue(r, "exponent"), f64: r.fraction } as Float64String)
  ),
  map(match(hexNan), r => ({
    ...pickValue(r, "isNegative"),
    f64: "nan",
    payload: r.nan
  })),
  map(match(nan), r => ({
    ...pickValue(r, "isNegative"),
    f64: "nan"
  })),
  map(match(inf), r => ({ f64: r }))
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
