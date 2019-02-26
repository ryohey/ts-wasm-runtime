import { section } from "./section"
import { vector, byte } from "../utils"
import { Parser, map, seq, or } from "@ryohey/fn-parser"
import { Bytes, name, typeIdx, tableIdx, memIdx, globalIdx } from "../types"

export interface FuncRef {
  func: number
}

export interface TableRef {
  table: number
}

export interface MemRef {
  mem: number
}

export interface GlobalRef {
  global: number
}

export type Desc = FuncRef | TableRef | MemRef | GlobalRef

export const importDesc: Parser<Bytes, Desc> = or(
  // func
  map(seq(byte(0x00), typeIdx), r => ({ func: r[1] })),
  // table
  map(seq(byte(0x01), tableIdx), r => ({ table: r[1] })),
  // mem
  map(seq(byte(0x02), memIdx), r => ({ mem: r[1] })),
  // global
  map(seq(byte(0x03), globalIdx), r => ({ global: r[1] }))
)

export interface Import {
  module: string
  name: string
  desc: Desc
}

const import_: Parser<Bytes, Import> = map(seq(name, name, importDesc), r => ({
  module: r[0],
  name: r[1],
  desc: r[2]
}))

export const importSection = section(2, "import", vector(import_))
