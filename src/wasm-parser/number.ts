import { Parser, seqMap, map } from "../parser/parser"
import { Bytes } from "./types"
import { var1, terminate } from "./utils"

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
