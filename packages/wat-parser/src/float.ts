// https://webassembly.github.io/spec/core/text/values.html#text-frac

import { or, map, type Parser } from "@ryohey/fn-parser"
import { regexp } from "@ryohey/s-parser"

export const float: Parser<string, number> = or(
  map(regexp(/^(-?0x[0-9a-fA-F][0-9a-fA-F_]*)$/), Number.parseInt),
  map(regexp(/^([-\+]?[0-9]+\.?[0-9]*?[Ee]?[-\+]?[0-9]*)$/), Number.parseFloat),
  map(regexp(/^([-\+]?nan)$/), () => Number.NaN),
  map(regexp(/^([-\+]?nan:0x[0-9a-fA-F]+)$/), () => Number.NaN),
  map(regexp(/^(\+?inf)$/), () => Number.POSITIVE_INFINITY),
  map(regexp(/^(-inf)$/), () => Number.NEGATIVE_INFINITY),
)
