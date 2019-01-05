import { map, seq, opt, Parser, or, many } from "../parser/parser"
import { keyword, array } from "./utils"
import {
  valType,
  ASTModuleNode,
  identifier,
  string,
  ValType,
  atom,
  blockType
} from "./types"
import { operations } from "./operations"
import { flatten } from "../misc/array"

export interface ASTFunction extends ASTModuleNode {
  nodeType: "func"
  identifier: string | null
  export: string | null
  parameters: ASTFunctionParameter[]
  results: ValType[]
  body: ASTFunctionInstruction[]
  locals: ASTFunctionLocal[]
}

export interface ASTFunctionParameter {
  identifier: string | null
  type: ValType
}
export interface ASTFunctionLocal {
  identifier: string | null
  type: ValType
}

export interface ASTFunctionInstruction {
  opType: string
  parameters: (string | number)[]
}

export const param = map(
  seq(keyword("param"), opt(identifier), valType),
  r => ({ identifier: r[1], type: r[2] } as ASTFunctionParameter)
)

export const local = map(
  seq(keyword("local"), opt(identifier), valType),
  r => ({ identifier: r[1], type: r[2] } as ASTFunctionLocal)
)

export const funcBody = map(many(operations), r => flatten(r))

export const func: Parser<atom[], ASTFunction> = map(
  seq(
    keyword("func"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    opt(many(array(param))),
    opt(array(blockType)),
    opt(many(array(local))),
    opt(funcBody)
  ),
  r => {
    return {
      nodeType: "func",
      identifier: r[1],
      export: r[2],
      parameters: r[3] || [],
      results: r[4] ? [r[4]] : [],
      locals: r[5] || [],
      body: r[6] || []
    } as ASTFunction
  }
)
