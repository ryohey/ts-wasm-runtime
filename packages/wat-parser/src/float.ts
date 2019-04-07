// https://webassembly.github.io/spec/core/text/values.html#text-frac

import { or, map, seq, opt, Parser } from "@ryohey/fn-parser"
import { regexp, token } from "@ryohey/s-parser"

export interface FloatingValue {
  fraction: string
  exponent?: string
}

export interface Nan {
  nan: string | null
  isNegative: boolean
}

export type Inf = "+inf" | "-inf"

const fraction = regexp(/^([-\+]?[0-9]+\.?[0-9]*)/)
const hexFraction = regexp(/^([-\+]?0x[0-9a-fA-F]+\.?[0-9a-fA-F]*)/)
const exponent = (str: string) =>
  map(
    seq(
      or(token(str.toUpperCase()), token(str.toLowerCase())),
      regexp(/^[-\+]?[0-9]+/)
    ),
    r => r[1]
  )

export const floatNum: Parser<string, FloatingValue> = or(
  map(
    seq(fraction, exponent("e")),
    r => ({ fraction: r[0], exponent: r[1] } as FloatingValue)
  ),
  map(fraction, r => ({ fraction: r } as FloatingValue))
)

export const hexFloatNum: Parser<string, FloatingValue> = or(
  map(
    seq(hexFraction, exponent("p")),
    r => ({ fraction: r[0], exponent: r[1] } as FloatingValue)
  ),
  map(hexFraction, r => ({ fraction: r } as FloatingValue))
)

const hexdigit = regexp(/^[0-9a-fA-F]+/)
const sign = or(map(token("+"), _ => true), map(token("-"), _ => false))

export const nan = map(
  seq(opt(sign), map(token("nan"), _ => ({ nan: null }))),
  r => ({ nan: null, isNegative: r[0] === null ? false : !r[0] } as Nan)
)

export const hexNan = map(
  seq(opt(sign), map(seq(token("nan:0x"), hexdigit), r => "0x" + r[1])),
  r => ({ nan: r[1], isNegative: r[0] === null ? false : !r[0] } as Nan)
)

export const inf = map(seq(opt(sign), token("inf")), r => {
  const isNegative = r[0] === null ? false : !r[0]
  return (isNegative ? "-inf" : "+inf") as Inf
})
