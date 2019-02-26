import { ValType, Op } from "@ryohey/wasm-ast"
import { map, seq } from "@ryohey/fn-parser"
import { u32 } from "../number"
import { valType } from "../types"
import { range, flatten } from "@ryohey/array-helper"
import { vector } from "../utils"
import { expr } from "../operations"
import { section } from "./section"

export interface Code {
  body: Op.Any[]
  locals: ValType[]
}

const locals = map(seq(u32, valType), r => range(0, r[0]).map(_ => r[1]))

const func = map(seq(vector(locals), expr), r => ({
  locals: flatten(r[0]),
  body: r[1] as Op.Any[]
}))

const code = map(
  seq(u32, func),
  r =>
    ({
      size: r[0],
      ...r[1]
    } as Code)
)

export const codeSection = section(10, "code", vector(code))
