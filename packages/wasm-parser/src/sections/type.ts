import { ValType } from "@ryohey/wasm-ast"
import { Parser, map, seq } from "@ryohey/fn-parser"
import { Bytes, valType } from "../types"
import { byte, vector } from "../utils"
import { section } from "./section"

export interface Type {
  parameters: ValType[]
  results: ValType[]
}

const funcType: Parser<Bytes, Type> = map(
  seq(byte(0x60), vector(valType), vector(valType)),
  r => ({
    parameters: r[1],
    results: r[2]
  })
)

export const typeSection = section(1, "type", vector(funcType))
