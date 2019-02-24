import { Parser, seqMap, map, terminate } from "@ryohey/fn-parser"
import { Bytes } from "./types"
import { var1 } from "./utils"
import {
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value
} from "@ryohey/wasm-ast"
import { zeroPad, binToHex } from "./misc/number"

// https://ja.osdn.net/projects/drdeamon64/wiki/LEB128%E3%81%AA%E6%95%B0%E3%81%AE%E8%A1%A8%E7%8F%BE

// returns variable length 7bit array
export const uLEB128Bytes: Parser<Bytes, Bytes> = seqMap(var1, r => {
  const isContinue = r >> 7 === 1
  const num = r & 0b0111_1111
  return isContinue ? map(uLEB128Bytes, r => [num, ...r]) : terminate([num])
})

// sums up 7bit array
export const u32 = map(uLEB128Bytes, r => {
  // 1 to 4 bytes
  let num = 0
  r.forEach((n, i) => {
    num += n << (7 * i)
  })
  return num
})

export const leb128Str: Parser<Bytes, string> = map(uLEB128Bytes, r => {
  const str = r.map(n => zeroPad(n.toString(2), 7)).join("")
  // TODO: support signed integer
  return "0x" + binToHex(str)
})

// TODO: Implement sLEB128

// https://webassembly.github.io/spec/core/binary/values.html#binary-int
export const i32: Parser<Bytes, Int32Value> = map(leb128Str, i32 => ({
  i32
}))
export const i64: Parser<Bytes, Int64Value> = map(leb128Str, i64 => ({
  i64
}))
export const f32: Parser<Bytes, Float32Value> = map(leb128Str, f32 => ({
  f32
}))
export const f64: Parser<Bytes, Float64Value> = map(leb128Str, f64 => ({
  f64
}))
