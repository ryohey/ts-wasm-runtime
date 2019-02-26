import { flatten } from "@ryohey/array-helper"
import { many, map, opt, Parser, seq } from "@ryohey/fn-parser"
import { Code, codeSection } from "./sections/code"
import { customSection } from "./sections/custom"
import { Data, dataSection } from "./sections/data"
import { Elem, elemSection } from "./sections/elem"
import { Export, exportSection } from "./sections/export"
import { funcSection } from "./sections/func"
import { Global, globalSection } from "./sections/global"
import { Import, importSection } from "./sections/import"
import { Mem, memorySection } from "./sections/mem"
import { Section } from "./sections/section"
import { Start, startsSection } from "./sections/start"
import { Table, tableSection } from "./sections/table"
import { Type, typeSection } from "./sections/type"
import { Bytes } from "./types"
import { bytes, string, var1 } from "./utils"

// https://webassembly.github.io/spec/core/binary/index.html

const beginWASM = map(seq(string("\0asm"), var1, bytes([0, 0, 0])), r => ({
  version: r[1]
}))

export type AnySection =
  | Section<{}>
  | Section<Type>
  | Section<Import>
  | Section<number> // Func
  | Section<Table>
  | Section<Mem>
  | Section<Global>
  | Section<Export>
  | Section<Start>
  | Section<Elem>
  | Section<Code>
  | Section<Data>

export interface Module {
  version: number
  sections: AnySection[]
}

export const moduleParser: Parser<Bytes, Module> = map(
  seq(
    beginWASM,
    seq<Bytes, AnySection[]>(
      opt(many(typeSection)),
      opt(many(customSection)),
      opt(many(importSection)),
      opt(many(customSection)),
      opt(many(funcSection)),
      opt(many(customSection)),
      opt(many(tableSection)),
      opt(many(customSection)),
      opt(many(memorySection)),
      opt(many(customSection)),
      opt(many(globalSection)),
      opt(many(customSection)),
      opt(many(exportSection)),
      opt(many(customSection)),
      opt(many(startsSection)),
      opt(many(customSection)),
      opt(many(elemSection)),
      opt(many(customSection)),
      opt(many(codeSection)),
      opt(many(customSection)),
      opt(many(dataSection)),
      opt(many(customSection))
    )
  ),
  r => ({
    version: r[0].version,
    sections: flatten(r[1].filter(x => x))
  })
)
