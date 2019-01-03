// Utilities for Parser<atom[]>

import { Parser, seq, many, or, opt, map } from "../parser/parser"

export type atom = string | number | AtomArray
interface AtomArray extends Array<atom> {}

const isString = (x: any): x is string =>
  typeof x === "string" || x instanceof String

export const keyword = (word: string): Parser<atom[], string> => (
  target,
  position
) => {
  if (target[position] === word) {
    return [true, word, position + 1]
  }
  return [
    false,
    null,
    position,
    `keyword@${position}: ${target[position]} is not ${word}`
  ]
}

export const regexp = (reg: RegExp): Parser<atom[], string> => (
  target,
  position
) => {
  const str = target[position]
  if (!isString(str)) {
    return [
      false,
      null,
      position,
      `regexp@${position}: ${target[position]} is not string`
    ]
  }
  reg.lastIndex = 0
  const result = reg.exec(str)
  return result
    ? [true, result[1], position + 1]
    : [
        false,
        null,
        position,
        `regexp@${position}: ${target[position]} does not match ${reg.source}`
      ]
}

// 配列内を渡された parser でパースする
export const array = <T>(parser: Parser<atom[], T>): Parser<atom[], T> => (
  target,
  position
) => {
  const arr = target[position]
  if (!Array.isArray(arr)) {
    return [false, null, position, `array@${position}: ${target} is not array`]
  }
  const result = parser(arr, 0)
  if (result[0]) {
    return [true, result[1], position + 1]
  }
  return [false, null, position, result[3]]
}

export const num: Parser<atom[], number> = (target, position) => {
  const v = target[position]
  if (typeof v !== "number") {
    return [false, null, position, `num@${position}: ${target} is not number`]
  }
  return [true, v, position + 1]
}
