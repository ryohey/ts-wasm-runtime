import { map, seq, opt } from "../parser/parser"
import { string, identifier, name, num } from "./types"
import { keyword, array } from "./utils"

export interface ASTTable {
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
