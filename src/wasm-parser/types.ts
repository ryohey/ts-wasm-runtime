import { or } from "../parser/parser"
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

export const valType = or(
  keyword("i32"),
  keyword("i64"),
  keyword("f32"),
  keyword("f64")
)
