import { type Parser, map, seq } from "@ryohey/fn-parser"
import { type Bytes, name } from "../types"
import { importDesc, type Desc } from "./import"
import { section } from "./section"
import { vector } from "../utils"

export interface Export {
  name: string
  desc: Desc
}

const export_: Parser<Bytes, Export> = map(seq(name, importDesc), (r) => ({
  name: r[0],
  desc: r[1],
}))

export const exportSection = section(7, "export", vector(export_))
