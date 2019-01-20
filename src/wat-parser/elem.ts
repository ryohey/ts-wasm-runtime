import { map, seq, many } from "../parser/parser"
import { identifier } from "./types"
import { keyword, array } from "./utils"
import { constInstructions } from "./operations"
import { ASTElem } from "../ast/module"

export const moduleElem = map(
  seq(keyword("elem"), array(constInstructions), many(identifier)),
  r =>
    ({
      nodeType: "elem",
      offset: r[1].parameter,
      funcIds: r[2]
    } as ASTElem)
)
