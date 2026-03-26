import { flatten } from "@ryohey/array-helper"
import { many, map, opt, type Parser, seq } from "@ryohey/fn-parser"
import { type Code, codeSection } from "./sections/code"
import { customSection } from "./sections/custom"
import { type Data, dataSection } from "./sections/data"
import { type Elem, elemSection } from "./sections/elem"
import { type Export, exportSection } from "./sections/export"
import { funcSection } from "./sections/func"
import { type Global, globalSection } from "./sections/global"
import { type Import, importSection } from "./sections/import"
import { type Mem, memorySection } from "./sections/mem"
import type { Section } from "./sections/section"
import { type Start, startsSection } from "./sections/start"
import { type Table, tableSection } from "./sections/table"
import { type Type, typeSection } from "./sections/type"
import type { Bytes } from "./types"
import { bytes, string, var1 } from "./utils"

// https://webassembly.github.io/spec/core/binary/index.html

const beginWASM = map(seq(string("\0asm"), var1, bytes([0, 0, 0])), (r) => ({
  version: r[1],
}))

export interface Module {
  version: number
  types: Type[]
  imports: Import[]
  funcs: number[]
  tables: Table[]
  mems: Mem[]
  globals: Global[]
  exports: Export[]
  starts: Start[]
  elems: Elem[]
  codes: Code[]
  data: Data[]
}

const getSections = <T>(obj: Section<T>[] | undefined | null): T[] =>
  obj === null || obj === undefined ? [] : flatten(obj.map((s) => s.sections))

export const moduleParser: Parser<Bytes, Module> = map(
  seq<Bytes, any>(
    beginWASM,
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
    opt(many(customSection)),
  ),
  (r) => ({
    version: r[0].version,
    types: getSections<Type>(r[1]),
    imports: getSections<Import>(r[3]),
    funcs: getSections<number>(r[5]),
    tables: getSections<Table>(r[7]),
    mems: getSections<Mem>(r[9]),
    globals: getSections<Global>(r[11]),
    exports: getSections<Export>(r[13]),
    starts: getSections<Start>(r[15]),
    elems: getSections<Elem>(r[17]),
    codes: getSections<Code>(r[19]),
    data: getSections<Data>(r[21]),
  }),
)
