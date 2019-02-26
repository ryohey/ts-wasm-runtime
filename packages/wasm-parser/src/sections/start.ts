import { FuncRef } from "./import"
import { Parser, map } from "@ryohey/fn-parser"
import { Bytes, funcIdx } from "../types"
import { section } from "./section"
import { vector } from "../utils"

export type Start = FuncRef

const start: Parser<Bytes, Start> = map(funcIdx, func => ({ func } as FuncRef))

export const startsSection = section(8, "start", vector(start))
