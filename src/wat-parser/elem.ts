import { map, seq, many } from "../parser/parser"
import { identifier, Int32Value } from "./types"
import { keyword, array } from "./utils"
import { constInstructions } from "./operations"

export interface ASTElem {
  nodeType: "elem"
  offset: Int32Value
  funcIds: (number | string)[]
}

export const moduleElem = map(
  seq(keyword("elem"), array(constInstructions), many(identifier)),
  r =>
    ({
      nodeType: "elem",
      offset: r[1].parameter,
      funcIds: r[2]
    } as ASTElem)
)
