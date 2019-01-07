import { map, seq, or, opt } from "../parser/parser"
import { ASTModuleNode, string, identifier, ValType, valType } from "./types"
import { keyword, array } from "./utils"
import { constInstructions } from "./operations"

export interface ASTGlobal extends ASTModuleNode {
  nodeType: "global"
  identifier: string | null
  export: string | null
  type: ValType
  mutable: boolean
}

export const moduleGlobal = map(
  seq(
    keyword("global"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    or(
      map(valType, r => ({ mutable: false, type: r })),
      map(array(seq(keyword("mut"), valType)), r => ({
        mutable: true,
        type: r[1]
      }))
    ),
    array(constInstructions)
  ),
  r =>
    ({
      nodeType: "global",
      identifier: r[1],
      export: r[2],
      type: r[3].type,
      mutable: r[3].mutable
    } as ASTGlobal)
)
