import { Parser, or, seq, lazy, opt, many, map } from "@ryohey/fn-parser"
import { regexp, token } from "./util"

export type Element = string | ElementArray
export interface ElementArray extends Array<Element> {}

const string = regexp(/^([^)^(^ ^\n]+)/)
const comment = regexp(/^;;.*\n/)
const separator = many(or(regexp(/^\s+/), comment))
const list: Parser<string, ElementArray> = lazy(() =>
  map(
    seq(
      opt(separator),
      map(
        seq(
          token("("),
          opt(separator),
          expression,
          opt(many(map(seq(separator, expression), r => r[1]))), // separator を含まない
          opt(separator),
          token(")")
        ),
        r => (r[3] !== null ? [r[2], ...r[3]] : [r[2]]) // 括弧を含まない flat な配列にする
      )
    ),
    r => r[1]
  )
)

export const expression = or(string, list)

export const parser = list
export const multiParser = many(
  map(
    seq(parser, opt(separator)),
    r => r[0] // remove separator
  )
)
