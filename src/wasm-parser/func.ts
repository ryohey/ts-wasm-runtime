import { map, seq, opt, Parser, or, many } from "../parser/parser"
import { keyword, array, atom } from "./utils"
import { valType, ASTModuleNode, identifier, string } from "./types"
import { operations } from "./operations"

export interface ASTFunction extends ASTModuleNode {
  nodeType: "func"
  identifier: string | null
  export: string | null
  parameters: ASTFunctionParameter[]
  result: ASTFunctionResult
  body: ASTFunctionInstruction[]
}

export interface ASTFunctionParameter {
  identifier: string | null
  type: string
}

export interface ASTFunctionResult {
  type: string
}

export interface ASTFunctionInstruction {
  opType: string
  parameters: any
}

const blockType = map(
  seq(keyword("result"), valType),
  r =>
    ({
      type: r[1]
    } as ASTFunctionResult)
)

export const param = map(
  seq(keyword("param"), opt(identifier), valType),
  r => ({ identifier: r[1], type: r[2] } as ASTFunctionParameter)
)

// とりあえず適当
export const funcBody = many(operations)

export const func: Parser<atom[], ASTFunction> = map(
  seq(
    keyword("func"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    opt(many(array(param))),
    opt(array(blockType)),
    opt(many(map(array(seq(keyword("local"), valType)), r => r[1]))),
    funcBody
  ),
  r => {
    return {
      nodeType: "func",
      identifier: r[1],
      export: r[2],
      parameters: r[3],
      result: r[4],
      locals: r[5],
      body: r[6]
    } as ASTFunction
  }
)
