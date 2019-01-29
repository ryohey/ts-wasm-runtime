import {
  seq,
  map,
  many,
  opt,
  fail,
  Parser,
  seqMap,
  transform,
  or,
  vec
} from "../parser/parser"
import { char, string, byte, variable, bytes } from "./utils"
import { Bytes } from "./types"
import { ValType } from "../ast/number"

const vector = <T>(parser: Parser<Bytes, T>) =>
  seqMap(variable(1), size => vec(parser, size[0]))

const beginWASM = map(
  seq(string("\0asm"), variable(1), bytes([0, 0, 0])),
  r => ({
    version: r[1][0]
  })
)

interface SectionStart {
  id: number
  size: number
}

const sectionStart = (id: number) =>
  map(
    seq(byte(id), variable(1)),
    r =>
      ({
        id,
        size: r[1][0]
      } as SectionStart)
  )

const section = <T>(id: number, body: Parser<Bytes, T>) =>
  seqMap(sectionStart(id), (sec: SectionStart) =>
    map(variable(sec.size), r => ({
      ...sec,
      body: body(r, 0)
    }))
  )

const i32 = map(byte(0x7f), _ => ValType.i32)
const i64 = map(byte(0x7e), _ => ValType.i64)
const f32 = map(byte(0x7d), _ => ValType.f32)
const f64 = map(byte(0x7c), _ => ValType.f64)

const valType = or(i32, i64, f32, f64)
const funcType = map(seq(byte(0x60), vector(valType), vector(valType)), r => ({
  nodeType: "type",
  parameters: r[1],
  results: r[2]
}))

const customSection = section(0, _ => null)
const typeSection = section(1, vector(funcType))
const importSection = section(2, _ => null)
const funcSection = section(3, _ => null)
const tableSection = section(4, _ => null)
const memorySection = section(5, _ => null)
const globalSection = section(6, _ => null)
const exportSection = section(7, _ => null)
const startsSection = section(8, _ => null)
const elemSection = section(9, _ => null)
const codeSection = section(10, _ => null)
const dataSection = section(11, _ => null)

// ∖0asm
export const moduleParser = seq<Bytes, any>(
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
)
