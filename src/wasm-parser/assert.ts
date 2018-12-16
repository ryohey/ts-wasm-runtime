import { map, seq } from "../parser/parser"
import { keyword, array } from "./utils"
import { string } from "./types"
import { operations } from "./operations"
import { ASTFunctionInstruction } from "./func"

export interface ASTAssertReturn {
  nodeType: "assert_return"
  invoke: string
  args: ASTFunctionInstruction[]
  expected: ASTFunctionInstruction[]
}

export const assertionParser = map(
  seq(
    keyword("assert_return"),
    array(seq(keyword("invoke"), string, array(operations))),
    array(operations)
  ),
  r => {
    return {
      nodeType: "assert_return",
      invoke: r[1][1],
      args: [r[1][2]],
      expected: [r[2]]
    } as ASTAssertReturn
  }
)
