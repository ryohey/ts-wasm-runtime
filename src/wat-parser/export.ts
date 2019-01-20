import { map, seq, or } from "../parser/parser"
import { string, identifier } from "./types"
import { keyword, array } from "./utils"
import { ASTExport } from "../ast/module"

export const moduleExport = map(
  seq(
    keyword("export"),
    string,
    or(
      array(seq(keyword("func"), identifier)),
      array(seq(keyword("memory"), identifier))
    )
  ),
  r =>
    ({
      nodeType: "export",
      exportType: r[2][0],
      identifier: r[2][1]
    } as ASTExport)
)
