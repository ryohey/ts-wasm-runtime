import { Parser, regexp, or, seq, token, lazy, opt, many, map } from "./parser"

const number = map(regexp(/^[0-9]+\.?[0-9]*/), parseFloat)
const text = regexp(/^[a-zA-Z\$][0-9a-zA-Z\._]*/)
const types = or(number, text)
const separator = regexp(/\s+/)
const list: Parser<string> = lazy(() =>
  map(
    seq(
      token("("),
      expression,
      opt(many(map(seq(separator, expression), r => r[1]))), // separator を含まない
      token(")")
    ),
    r => (r[2] !== null ? [r[1], ...r[2]] : [r[1]]) // 括弧を含まない flat な配列にする
  )
)
const expression = or(types, list)

export const parser = expression
