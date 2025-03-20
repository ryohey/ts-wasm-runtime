import { seq, Parser, many, map, or, opt } from "@ryohey/fn-parser"

const regexp = (reg: RegExp): Parser<string, string> => (target, position) => {
  reg.lastIndex = 0
  const result = reg.exec(target.slice(position))
  return result
    ? [true, result[0], position + result[0].length]
    : [false, null, position]
}

const token = (str: string) => regexp(new RegExp(str))

// parse `add(1, 2)` to `"add", "1", "2"`
const number = regexp(/-?[0-9]+\.?[0-9]*/)

// parses x and x, ..., x
const separated = <T>(
  parser: Parser<string, T>,
  separator: string
): Parser<string, T[]> =>
  map(
    seq(opt(many(map(seq(parser, token(separator)), r => r[0]))), parser),
    r => [...(r[0] || []), r[1]]
  )

const functionCall = map(
  seq(
    regexp(/[a-zA-Z]+/),
    token("\\("),
    opt(separated(number, ",")),
    token("\\)")
  ),
  r => ({
    type: "func-call",
    name: r[0],
    arguments: r[2]
  })
)

export const parseConsoleInput = or(functionCall)
