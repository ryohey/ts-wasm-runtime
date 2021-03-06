import { Op } from "@ryohey/wasm-ast"
import { Parser, map, seq } from "@ryohey/fn-parser"
import { Bytes, memIdx } from "../types"
import { initializer } from "../operations"
import { vector, var1 } from "../utils"
import { section } from "./section"

export interface Data {
  data: number
  offset: Op.Initializer
  init: number[]
}

const data: Parser<Bytes, Data> = map(
  seq(memIdx, initializer, vector(var1)),
  r => ({
    data: r[0],
    offset: r[1],
    init: r[2]
  })
)

export const dataSection = section(11, "data", vector(data))
