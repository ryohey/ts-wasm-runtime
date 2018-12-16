import { map, seq, opt, Parser, or, many } from "../parser/parser"
import { keyword, array, atom } from "./utils"
import { valType, ASTModuleNode, identifier, string } from "./types"
import { operations } from "./operations"

export interface ASTFunction extends ASTModuleNode {
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

const blockType = map(seq(keyword("result"), valType), r => ({
  type: r[1]
}))

const instr = or(operations)
export const param: Parser<atom[]> = map(
  seq(keyword("param"), opt(identifier), valType),
  r => ({ identifier: r[1], type: r[2] })
)

// とりあえず適当
export const funcBody = many(instr)

export const func: Parser<atom[]> = map(
  seq(
    keyword("func"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    opt(many(array(param))),
    opt(array(blockType)),
    funcBody
  ),
  r => {
    return {
      nodeType: "func",
      identifier: r[1],
      export: r[2],
      parameters: r[3],
      result: r[4],
      body: r[5]
    } as ASTFunction
  }
)
