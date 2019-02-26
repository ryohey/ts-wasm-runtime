import { Limits, limits, Bytes } from "../types"
import { Parser } from "@ryohey/fn-parser"
import { section } from "./section"
import { vector } from "../utils"

export type Mem = Limits
const mem = limits
const memType: Parser<Bytes, Mem> = mem

export const memorySection = section(5, "mem", vector(memType))
