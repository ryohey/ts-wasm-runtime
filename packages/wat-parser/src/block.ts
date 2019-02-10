import { Parser, seq, many, opt, or, lazy, map } from "@ryohey/fn-parser"
import { Element } from "@ryohey/s-parser"
import { Op } from "@ryohey/wasm-ast"
import { blockType, identifier } from "./types"
import { keyword, array } from "./utils"
import { operations } from "./operations"
import { flatten } from "@ryohey/array-helper"

const instructions = lazy(() => operations)

const makeBlockBody = (word: string): Parser<Element[], Op.Any[]> =>
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
        body: flatten(r[3] || [])
      } as Op.Block
    ]
  )

const makePlainBlock = (word: string): Parser<Element[], Op.Any[]> =>
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
