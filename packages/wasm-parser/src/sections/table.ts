import { Parser, map, seq } from "@ryohey/fn-parser"
import { Bytes, Limits, limits } from "../types"
import { byte, vector } from "../utils"
import { section } from "./section"

export enum ElemType {
  funcref = 0x70
}

// currently there is a only 0x70 in element type
const elemtype: Parser<Bytes, ElemType> = byte(0x70)

export interface Table {
  et: ElemType
  lim: Limits
}

const table: Parser<Bytes, Table> = map(seq(elemtype, limits), r => ({
  et: r[0],
  lim: r[1]
}))

export const tableSection = section(4, "table", vector(table))
