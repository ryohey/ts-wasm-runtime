import { seq, many, lazy, opt, map, or } from "@ryohey/fn-parser"
import { Op } from "@ryohey/wasm-ast"
import { keyword, array } from "./utils"
import { operations } from "./operations"
import { blockType, identifier } from "./types"
import { flatten } from "@ryohey/array-helper"

const instructions = lazy(() => operations)

const ifPlain = map(
  seq(
    keyword("if"),
    opt(identifier),
    opt(array(blockType)),
    opt(many(instructions)),
    keyword("else"),
    opt(many(instructions)),
    keyword("end")
  ),
  r => [
    {
      opType: "if",
      identifier: r[1],
      results: r[2] ? [r[2]] : [],
      then: flatten(r[3] || []),
      else: flatten(r[5] || [])
    } as Op.If
  ]
)

const ifBlock = map(
  array(
    seq(
      keyword("if"),
      opt(identifier),
      opt(array(blockType)),
      opt(instructions),
      array(seq(keyword("then"), opt(many(instructions)))),
      array(seq(keyword("else"), opt(many(instructions))))
    )
  ),
  r => [
    ...(r[3] || []),
    {
      opType: "if",
      identifier: r[1],
      results: r[2] ? [r[2]] : [],
      then: flatten(r[4][1] || []),
      else: flatten(r[5][1] || [])
    } as Op.If
  ]
)

// no result
const ifPlain2 = map(
  seq(keyword("if"), opt(identifier), opt(many(instructions)), keyword("end")),
  r => [
    {
      opType: "if",
      results: [],
      identifier: r[1],
      then: flatten(r[2] || []),
      else: []
    } as Op.If
  ]
)

// no result
const ifBlock2 = map(
  array(
    seq(
      keyword("if"),
      opt(identifier),
      opt(instructions),
      array(seq(keyword("then"), opt(many(instructions))))
    )
  ),
  r => [
    ...(r[2] || []),
    {
      opType: "if",
      results: [],
      identifier: r[1],
      then: flatten(r[3][1] || []),
      else: []
    } as Op.If
  ]
)

export const ifParser = or(ifPlain, ifBlock, ifPlain2, ifBlock2)
