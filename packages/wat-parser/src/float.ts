// https://webassembly.github.io/spec/core/text/values.html#text-frac

import { or, map, seq, opt, Parser } from "@ryohey/fn-parser"
import { regexp, token } from "../../s-parser/src/util"

export interface FloatingValue {
  type: "number"
  p: string
  e: string | null
  isHex?: boolean
}

const floatNum: Parser<string, FloatingValue> = or(
  map(
    seq(
      regexp(/^[-\+]?0x[0-9a-fA-F]+\.?[0-9a-fA-F]*/),
      opt(
        map(seq(or(token("P"), token("p")), regexp(/^[-\+]?[0-9]+/)), r => r[1])
      )
    ),
    r => ({ type: "number", p: r[0], e: r[1], isHex: true } as FloatingValue)
  ),
  map(
    seq(
      regexp(/^[-\+]?[0-9]+\.?[0-9]*/),
      opt(
        map(seq(or(token("E"), token("e")), regexp(/^[-\+]?[0-9]+/)), r => r[1])
      )
    ),
    r => ({ type: "number", p: r[0], e: r[1] } as FloatingValue)
  )
)

export interface Nan {
  type: "nan"
  payload?: string
  isNegative: boolean
  isHex?: boolean
}

export interface Inf {
  type: "inf"
  isNegative: boolean
}

const hexdigit = regexp(/^[0-9a-fA-F]+/)
const sign = or(map(token("+"), _ => true), map(token("-"), _ => false))
const nan = map(
  seq(
    opt(sign),
    or(
      map(seq(token("nan:0x"), hexdigit), r => ({
        payload: "0x" + r[1],
        isHex: true
      })),
      map(token("nan"), _ => ({}))
    )
  ),
  r =>
    ({ ...r[1], type: "nan", isNegative: r[0] === null ? false : !r[0] } as Nan)
)

const inf = map(
  seq(opt(sign), token("inf")),
  r => ({ type: "inf", isNegative: r[0] === null ? false : !r[0] } as Inf)
)

export type Float = Inf | Nan | FloatingValue

export const float: Parser<string, Float> = or(nan, inf, floatNum)
