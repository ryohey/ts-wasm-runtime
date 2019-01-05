import { or, map, seq } from "../parser/parser"
import { num, regexp, keyword } from "./utils"

export type atom = string | number | AtomArray
export interface AtomArray extends Array<atom> {}

export const identifier = regexp(
  /^(\$[a-zA-Z][a-zA-Z0-9_.+-\\*/\\^~=<>!?@#$%&|:'`]*)$/
)
export const name = regexp(/^([a-zA-Z]+)$/)
export const string = regexp(/^\"(.+)\"/)
export const operand = or(num, identifier)

export interface ASTModuleNode {
  nodeType: string
}

export enum ValType {
  i32 = "i32",
  i64 = "i64",
  f32 = "f32",
  f64 = "f64"
}

export const valType = or(
  keyword(ValType.i32),
  keyword(ValType.i64),
  keyword(ValType.f32),
  keyword(ValType.f64)
)

export const blockType = map(seq(keyword("result"), valType), r => r[1])
