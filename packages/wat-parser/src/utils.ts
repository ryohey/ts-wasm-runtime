// Utilities for Parser<Element[]>

import { Parser } from "@ryohey/fn-parser"
import {
  IntElement,
  HexElement,
  FloatElement,
  Element
} from "@ryohey/s-parser"
import { isString } from "util"

export const keyword = <T extends string>(word: T): Parser<Element[], T> => (
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

export const regexp = (reg: RegExp): Parser<Element[], string> => (
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
export const array = <T>(
  parser: Parser<Element[], T>
): Parser<Element[], T> => (target, position) => {
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

export const isIntElement = (v: any): v is IntElement => {
  return v instanceof Object && "int" in v
}
export const isHexElement = (v: any): v is HexElement => {
  return v instanceof Object && "hex" in v
}
export const isFloatElement = (v: any): v is FloatElement => {
  return v instanceof Object && "float" in v
}

export const is = <T extends Element>(
  fn: (x: Element) => x is T
): Parser<Element[], T> => (target, position) => {
  const v = target[position]
  if (fn(v)) {
    return [true, v, position + 1]
  }
  return [false, null, position]
}
