import { or, map, Parser, seq } from "@ryohey/fn-parser"
import { byte, vector } from "../utils"
import { ValType, Op } from "@ryohey/wasm-ast"
import { Bytes, valType } from "../types"
import { expr } from "../operations"
import { section } from "./section"

const mut = or(map(byte(0x00), _ => false), map(byte(0x01), _ => true))

export interface GlobalType {
  type: ValType
  isMutable: boolean
}

const globalType: Parser<Bytes, GlobalType> = map(seq(valType, mut), r => ({
  type: r[0],
  isMutable: r[1]
}))

export interface Global {
  type: GlobalType
  init: Op.Any[]
}

const global_: Parser<Bytes, Global> = map(seq(globalType, expr), r => ({
  type: r[0],
  init: r[1]
}))

export const globalSection = section(6, "global", vector(global_))
