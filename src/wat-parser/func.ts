import { map, seq, opt, Parser, many } from "../parser/parser"
import { keyword, array } from "./utils"
import { valType, identifier, string, blockType } from "./types"
import { operations } from "./operations"
import { flatten } from "../misc/array"
import { Element } from "../s-parser/s-parser"
import {
  ASTFunctionParameter,
  ASTFunctionLocal,
  ASTFunction
} from "../ast/module"

export const param = map(
  seq(keyword("param"), opt(identifier), many(valType)),
  r => r[2].map(type => ({ identifier: r[1], type } as ASTFunctionParameter))
)

export const local = map(
  seq(keyword("local"), opt(identifier), many(valType)),
  r => r[2].map(type => ({ identifier: r[1], type } as ASTFunctionLocal))
)

export const funcBody = map(many(operations), r => flatten(r))

export const func: Parser<Element[], ASTFunction> = map(
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
      parameters: flatten(r[3] || []),
      results: r[4] ? [r[4]] : [],
      locals: flatten(r[5] || []),
      body: r[6] || []
    } as ASTFunction
  }
)
