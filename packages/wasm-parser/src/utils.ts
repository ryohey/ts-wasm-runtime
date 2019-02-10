import { Parser, seq, seqMap, vec, pass } from "@ryohey/fn-parser"
import { Bytes, Byte } from "./types"

export const char = (chr: string): Parser<Bytes, Byte> => (
  target,
  position
) => {
  if (target[position] === chr.charCodeAt(0)) {
    return [true, target[position], position + 1]
  }
  return [false, null, position]
}

export const string = (str: string) => seq(...str.split("").map(char))

export const byte = (num: number): Parser<Bytes, Byte> => (
  target,
  position
) => {
  if (target[position] === num) {
    return [true, target[position], position + 1]
  }
  return [false, null, position]
}

export const bytes = (data: number[]) => seq(...data.map(byte))

export const variable = (size: number): Parser<Bytes, Bytes> => (
  target,
  position
) => {
  if (target.length < position + size) {
    return [
      false,
      target,
      position,
      `target is smaller than ${position + size}`
    ]
  }
  return [true, target.slice(position, position + size), position + size]
}

export const var1: Parser<Bytes, Byte> = pass

export const vector = <T>(parser: Parser<Bytes, T>) =>
  seqMap(var1, size => vec(parser, size))
