import { map, seq, opt } from "../parser/parser"
import { ASTModuleNode, string, identifier, name } from "./types"
import { keyword, array, num } from "./utils"

export interface ASTTable extends ASTModuleNode {
  nodeType: "table"
  identifier: string | null
  export: string | null
}

export const moduleTable = map(
  seq(
    keyword("table"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    num,
    num,
    name
  ),
  r =>
    ({
      nodeType: "table",
      identifier: r[1],
      export: r[2]
    } as ASTTable)
)
