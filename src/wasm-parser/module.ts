import { ASTFunction, func } from "./func"
import { seq, or, map, many } from "../parser/parser"
import { keyword, array } from "./utils"
import { string, identifier } from "./types"

export interface ASTModule {
  nodeType: "module"
  functions: ASTFunction[]
  // types
  // tables
  // globals
  // memories
}

const moduleExport = seq(
  keyword("export"),
  string,
  or(
    array(seq(keyword("func"), identifier)),
    array(seq(keyword("memory"), identifier))
  )
)

export const moduleParser = map(
  seq(keyword("module"), many(or(array(moduleExport), array(func)))),
  r => {
    return {
      nodeType: "module",
      functions: r[1].filter(n => n.nodeType === "func")
    }
  }
)
