import { map, seq, or } from "@ryohey/fn-parser"
import { ASTExport } from "@ryohey/wasm-ast"
import { string, identifier } from "./types"
import { keyword, array } from "./utils"

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
