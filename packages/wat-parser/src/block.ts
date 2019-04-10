import { flatten } from "@ryohey/array-helper"
import { lazy, many, map, opt, or, Parser, seq } from "@ryohey/fn-parser"
import { Element } from "@ryohey/s-parser"
import { operations } from "./operations"
import { blockType, identifier } from "./types"
import { array, keyword } from "./utils"
import { TextOp } from "."

const instructions = lazy(() => operations)

type BlockOp = TextOp.Block | TextOp.Loop

const makeBlockBody = <T extends BlockOp>(
  word: string,
  opType: T["opType"]
): Parser<Element[], T> =>
  map(
    seq(
      keyword(word),
      opt(identifier),
      opt(array(blockType)),
      opt(many(instructions))
    ),
    r =>
      ({
        opType,
        identifier: r[1],
        results: r[2] ? [r[2]] : [],
        body: flatten(r[3] || [])
      } as T)
  )

const makePlainBlock = <T extends BlockOp>(word: string, opType: T["opType"]) =>
  map(seq(makeBlockBody<T>(word, opType), keyword("end")), r => r[0])

const makeFoldedBlock = <T extends BlockOp>(
  word: string,
  opType: T["opType"]
) => array(makeBlockBody<T>(word, opType))
const makeBlock = <T extends BlockOp>(word: string, opType: T["opType"]) =>
  or(makePlainBlock<T>(word, opType), makeFoldedBlock<T>(word, opType))

export const block = makeBlock<TextOp.Block>("block", "text.block")
export const loop = makeBlock<TextOp.Loop>("loop", "text.loop")

export const blockInstructions = or(block, loop)
