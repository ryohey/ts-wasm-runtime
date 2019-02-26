import { byte, var1, variable } from "./utils"
import { or, map, seqMap, Parser, seq } from "@ryohey/fn-parser"
import { ValType } from "@ryohey/wasm-ast"
import { u32 } from "./number"

export type Bytes = number[]
export type Byte = Bytes[0]

export const valType = or(
  map(byte(0x7f), _ => ValType.i32),
  map(byte(0x7e), _ => ValType.i64),
  map(byte(0x7d), _ => ValType.f32),
  map(byte(0x7c), _ => ValType.f64)
)

// utf8 encoded byte array
export const name = seqMap(var1, size =>
  map(variable(size), r => r.map(c => String.fromCharCode(c)).join(""))
)

export const funcIdx = u32
export const typeIdx = u32
export const tableIdx = u32
export const memIdx = u32
export const globalIdx = u32
export const localIdx = u32
export const labelIdx = u32

export interface Limits {
  min: number
  max?: number
}

export const limits: Parser<Bytes, Limits> = or(
  map(seq(byte(0x00), var1), r => ({ min: r[1] })),
  map(seq(byte(0x01), var1, var1), r => ({ min: r[1], max: r[2] }))
)
