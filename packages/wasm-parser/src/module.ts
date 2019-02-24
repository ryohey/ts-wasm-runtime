import { many, map, opt, or, Parser, seq, seqMap } from "@ryohey/fn-parser"
import { u32 } from "./number"
import { expr } from "./operations"
import { Bytes, valType } from "./types"
import { byte, bytes, string, var1, variable, vector } from "./utils"
import { ASTFunction, ASTFunctionLocal, Op, ValType } from "@ryohey/wasm-ast"
import { range, flatten } from "@ryohey/array-helper"

// https://webassembly.github.io/spec/core/binary/index.html

const typeIdx = u32
const funcIdx = u32
const tableIdx = u32
const memIdx = u32
const globalIdx = u32
const localIdx = u32
const labelIdx = u32

const beginWASM = map(seq(string("\0asm"), var1, bytes([0, 0, 0])), r => ({
  version: r[1]
}))

interface SectionStart {
  id: number
  size: number
}

interface Section<T> extends SectionStart {
  nodeType: string
  sections: T[]
}

const sectionStart = (id: number) =>
  map(
    seq(byte(id), u32),
    r =>
      ({
        id,
        size: r[1]
      } as SectionStart)
  )

const section = <T>(id: number, nodeType: string, body: Parser<Bytes, T[]>) =>
  seqMap(sectionStart(id), (sec: SectionStart) =>
    map(variable(sec.size), r => {
      const b = body(r, 0)
      return {
        nodeType,
        ...sec,
        sections: b ? b[1] : []
      }
    })
  ) as Parser<Bytes, Section<T>>

interface Type {
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

// utf8 encoded byte array
const name = seqMap(var1, size =>
  map(variable(size), r => r.map(c => String.fromCharCode(c)).join(""))
)

interface FuncRef {
  func: number
}

interface TableRef {
  table: number
}

interface MemRef {
  mem: number
}

interface GlobalRef {
  global: number
}

type Desc = FuncRef | TableRef | MemRef | GlobalRef

const importDesc: Parser<Bytes, Desc> = or(
  // func
  map(seq(byte(0x00), typeIdx), r => ({ func: r[1] })),
  // table
  map(seq(byte(0x01), tableIdx), r => ({ table: r[1] })),
  // mem
  map(seq(byte(0x02), memIdx), r => ({ mem: r[1] })),
  // global
  map(seq(byte(0x03), globalIdx), r => ({ global: r[1] }))
)

interface Import {
  module: string
  name: string
  desc: Desc
}

const import_: Parser<Bytes, Import> = map(seq(name, name, importDesc), r => ({
  module: r[0],
  name: r[1],
  desc: r[2]
}))

interface Limits {
  min: number
  max?: number
}

const limits: Parser<Bytes, Limits> = or(
  map(seq(byte(0x00), var1), r => ({ min: r[1] })),
  map(seq(byte(0x01), var1, var1), r => ({ min: r[1], max: r[2] }))
)

enum ElemType {
  funcref = 0x70
}

// currently there is a only 0x70 in element type
const elemtype: Parser<Bytes, ElemType> = byte(0x70)

interface Table {
  et: ElemType
  lim: Limits
}

const table: Parser<Bytes, Table> = map(seq(elemtype, limits), r => ({
  et: r[0],
  lim: r[1]
}))

const mem = limits
const memType = mem

const mut = or(map(byte(0x00), _ => false), map(byte(0x01), _ => true))

interface GlobalType {
  type: ValType
  isMutable: boolean
}

const globalType: Parser<Bytes, GlobalType> = map(seq(valType, mut), r => ({
  type: r[0],
  isMutable: r[1]
}))

interface Global {
  type: GlobalType
  init: Op.Any[]
}

const global_: Parser<Bytes, Global> = map(seq(globalType, expr), r => ({
  type: r[0],
  init: r[1]
}))

interface Export {
  name: string
  desc: Desc
}

const exportDesc = importDesc
const export_: Parser<Bytes, Export> = map(seq(name, exportDesc), r => ({
  name: r[0],
  desc: r[1]
}))

const start = map(funcIdx, func => ({ func } as FuncRef))

interface Elem {
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

interface Data {
  data: number
  offset: Op.Any[]
  init: number[]
}

const data: Parser<Bytes, Data> = map(seq(memIdx, expr, vector(var1)), r => ({
  data: r[0],
  offset: r[1],
  init: r[2]
}))

interface ASTCode {
  body: Op.Any[]
  locals: ASTFunctionLocal[]
}

const locals = map(seq(u32, valType), r =>
  range(0, r[0]).map(_ => ({ type: r[1] } as ASTFunctionLocal))
)

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
    } as ASTCode)
)

const customSection = section(0, "custom", _ => null)
const typeSection = section(1, "type", vector(funcType))
const importSection = section(2, "import", vector(import_))
const funcSection = section(3, "func", vector(typeIdx))
const tableSection = section(4, "table", vector(table))
const memorySection = section(5, "mem", vector(memType))
const globalSection = section(6, "global", vector(global_))
export const exportSection = section(7, "export", vector(export_))
const startsSection = section(8, "start", vector(start))
export const elemSection = section(9, "elem", vector(elem))
const codeSection = section(10, "code", vector(code))
const dataSection = section(11, "data", vector(data))

export const moduleParser = map(
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
    opt(many(customSection))
  ),
  r => r.filter(x => x)
)
