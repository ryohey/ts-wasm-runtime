import { Parser, seq, many, opt, or, lazy, map } from "../parser/parser"
import { atom, blockType, identifier, ValType } from "./types"
import { keyword, array } from "./utils"
import { operations } from "./operations"
import { ASTFunctionInstruction } from "./func"
import { flatten } from "../misc/array"

export interface ASTBlock extends ASTFunctionInstruction {
  identifier: string | null
  results: ValType[]
  body: ASTFunctionInstruction[]
}

const instructions = lazy(() => operations)

const makeBlockBody = (
  word: string
): Parser<atom[], (ASTBlock | ASTFunctionInstruction)[]> =>
  map(
    seq(
      keyword(word),
      opt(identifier),
      opt(array(blockType)),
      opt(many(instructions))
    ),
    r => [
      {
        opType: word,
        identifier: r[1],
        results: r[2] ? [r[2]] : [],
        parameters: [],
        body: flatten(r[3] || [])
      } as ASTBlock
    ]
  )

const makePlainBlock = (
  word: string
): Parser<atom[], ASTFunctionInstruction[]> =>
  map(seq(makeBlockBody(word), keyword("end")), r => r[0])

const makeFoldedBlock = (word: string) => array(makeBlockBody(word))
const makeBlock = (word: string) =>
  or(makePlainBlock(word), makeFoldedBlock(word))

export const block = makeBlock("block")
export const loop = makeBlock("loop")

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

export const blockInstructions = or(block, loop, ifend, ifelse)
