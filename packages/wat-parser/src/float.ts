// https://webassembly.github.io/spec/core/text/values.html#text-frac

import { or, map, Parser } from "@ryohey/fn-parser"
import { regexp } from "@ryohey/s-parser"

export const float: Parser<string, number> = or(
  map(regexp(/^(-?0x[0-9a-fA-F][0-9a-fA-F_]*)$/), parseInt),
  map(regexp(/^([-\+]?[0-9]+\.?[0-9]*?[Ee]?[-\+]?[0-9]*)$/), parseFloat),
  map(regexp(/^([-\+]?nan)$/), () => NaN),
  map(regexp(/^([-\+]?nan:0x[0-9a-fA-F]+)$/), () => NaN),
  map(regexp(/^(\+?inf)$/), () => Infinity),
  map(regexp(/^(-inf)$/), () => -Infinity)
)
