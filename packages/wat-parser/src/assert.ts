import { map, seq, opt, many } from "@ryohey/fn-parser"
import { Op } from "@ryohey/wasm-ast"
import { keyword, array } from "./utils"
import { string } from "./types"
import { operations } from "./operations"
import { flatten } from "@ryohey/array-helper"

export interface WATAssertReturn {
  nodeType: "assert_return"
  invoke: string
  args: Op.Const[]
  expected: Op.Const[]
}

export const assertionParser = map(
  seq(
    keyword("assert_return"),
    array(seq(keyword("invoke"), string, opt(many(array(operations))))),
    opt(array(operations))
  ),
  r => {
    return {
      nodeType: "assert_return",
      invoke: r[1][1],
      args: flatten(r[1][2] || []),
      expected: r[2] || []
    } as WATAssertReturn
  }
)
