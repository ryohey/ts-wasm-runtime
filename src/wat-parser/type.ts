import { map, seq, opt } from "../parser/parser"
import { identifier, blockType } from "./types"
import { keyword, array } from "./utils"
import { ASTType } from "../ast/module"

const funcDef = seq(keyword("func"), opt(blockType))

export const moduleType = map(
  seq(keyword("type"), opt(identifier), array(funcDef)),
  r =>
    ({
      nodeType: "type",
      identifier: r[1]
    } as ASTType)
)
