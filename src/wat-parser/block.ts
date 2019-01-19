import { Parser, seq, many, opt, or, lazy, map } from "../parser/parser"
import { blockType, identifier, ValType } from "./types"
import { keyword, array } from "./utils"
import { operations } from "./operations"
import { ASTFunctionInstruction, AnyParameter } from "./func"
import { flatten } from "../misc/array"
import { Element } from "../s-parser/s-parser"

export interface ASTBlock extends ASTFunctionInstruction<AnyParameter> {
  opType: "block"
  identifier: string | null
  results: ValType[]
  body: ASTFunctionInstruction<AnyParameter>[]
}

export const isBlockInstruction = (
  inst: ASTFunctionInstruction<AnyParameter>
): inst is ASTBlock => {
  return inst.opType === "block" || inst.opType === "loop"
}

const instructions = lazy(() => operations)

const makeBlockBody = (
  word: string
): Parser<Element[], (ASTBlock | ASTFunctionInstruction<AnyParameter>)[]> =>
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
): Parser<Element[], ASTFunctionInstruction<AnyParameter>[]> =>
  map(seq(makeBlockBody(word), keyword("end")), r => r[0])

const makeFoldedBlock = (word: string) => array(makeBlockBody(word))
const makeBlock = (word: string) =>
  or(makePlainBlock(word), makeFoldedBlock(word))

export const block = makeBlock("block")
export const loop = makeBlock("loop")

export const ifend: Parser<Element[], any> = seq(
  keyword("if"),
  many(instructions),
  keyword("end")
)

export const ifelse: Parser<Element[], any> = seq(
  keyword("if"),
  many(instructions),
  keyword("else"),
  many(instructions),
  keyword("end")
)

export const blockInstructions = or(block, loop, ifend, ifelse)
