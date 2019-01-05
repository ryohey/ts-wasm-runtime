import { Parser, seq, many, opt, or, lazy, map } from "../parser/parser"
import { atom, blockType, identifier } from "./types"
import { keyword, array } from "./utils"
import { operations } from "./operations"
import { ASTFunctionInstruction } from "./func"
import { flatten } from "../misc/array"

const instructions = lazy(() => operations)

const blockBody: Parser<atom[], ASTFunctionInstruction[]> = map(
  seq(
    keyword("block"),
    opt(identifier),
    opt(blockType),
    opt(many(instructions))
  ),
  r =>
    [
      { opType: "block", parameters: [] },
      ...flatten(r[3])
    ] as ASTFunctionInstruction[]
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
