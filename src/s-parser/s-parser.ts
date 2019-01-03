import {
  Parser,
  regexp,
  or,
  seq,
  token,
  lazy,
  opt,
  many,
  map
} from "../parser/parser"

export type Element = string | number | ElementArray
export interface ElementArray extends Array<Element> {}

const number = map(regexp(/^[0-9]+\.?[0-9]*/), parseFloat)
const text = regexp(/^[a-zA-Z\$][0-9a-zA-Z\._]*/)
const string = regexp(/^(".+")/)
const types = or(number, text, string)
const separator = regexp(/^\s+/)
const list: Parser<string, ElementArray> = lazy(() =>
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
)
export const expression = or(types, list)

export const parser = list
export const multiParser = many(
  map(
    seq(parser, opt(separator)),
    r => r[0] // remove separator
  )
)
