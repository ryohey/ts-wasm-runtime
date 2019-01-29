import { Parser, seq } from "../parser/parser"
import { Bytes, Byte } from "./types"
import { range } from "../misc/array"

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

export const ok: Parser<Bytes, Byte> = (target, position) => {
  return [true, target[position], position + 1]
}

export const variable = (size: number) => seq(...range(0, size).map(_ => ok))
