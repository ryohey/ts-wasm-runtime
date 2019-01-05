import { Parser, seq, many, opt, or, lazy, map } from "../parser/parser"
import { atom, blockType, identifier, ValType } from "./types"
import { keyword, array } from "./utils"
import { operations } from "./operations"
import { ASTFunctionInstruction } from "./func"
import { flatten } from "../misc/array"

export interface ASTBlock extends ASTFunctionInstruction {
  identifier: string | null
  result: ValType
  body: ASTFunctionInstruction[]
}

const instructions = lazy(() => operations)

const blockBody: Parser<atom[], (ASTBlock | ASTFunctionInstruction)[]> = map(
  seq(
    keyword("block"),
    opt(identifier),
    opt(array(blockType)),
    opt(many(instructions))
  ),
  r => [
    {
      opType: "block",
      identifier: r[1],
      result: r[2],
      body: flatten(r[3] || []),
      parameters: []
    } as ASTBlock
  ]
)

export const block: Parser<atom[], ASTFunctionInstruction[]> = map(
  seq(blockBody, keyword("end")),
  r => r[0]
)

export const block2 = array(blockBody)

export const loop: Parser<atom[], any> = seq(
  keyword("loop"),
  many(instructions),
  keyword("end")
)

export const ifend: Parser<atom[], any> = seq(
  keyword("if"),
  many(instructions),
  keyword("end")
)

export const ifelse: Parser<atom[], any> = seq(
  keyword("if"),
  many(instructions),
  keyword("else"),
  many(instructions),
  keyword("end")
)

export const blockInstructions = or(block, block2, loop, ifend, ifelse)
