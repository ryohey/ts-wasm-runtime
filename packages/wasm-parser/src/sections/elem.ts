import { Op } from "@ryohey/wasm-ast"
import { Parser, map, seq } from "@ryohey/fn-parser"
import { Bytes, tableIdx, funcIdx } from "../types"
import { expr } from "../operations"
import { vector } from "../utils"
import { section } from "./section"

export interface Elem {
  table: number
  offset: Op.Any[]
  init: number[]
}

const elem: Parser<Bytes, Elem> = map(
  seq(tableIdx, expr, vector(funcIdx)),
  r => ({
    table: r[0],
    offset: r[1],
    init: r[2]
  })
)

export const elemSection = section(9, "elem", vector(elem))
