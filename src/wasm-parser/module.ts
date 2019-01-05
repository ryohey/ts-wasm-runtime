import { ASTFunction, func } from "./func"
import { seq, or, map, many } from "../parser/parser"
import { keyword, array } from "./utils"
import { string, identifier, ASTModuleNode } from "./types"

export interface ASTModule {
  nodeType: "module"
  functions: ASTFunction[]
  exports: ASTExport[]
  // types
  // tables
  // globals
  // memories
}

export interface ASTExport extends ASTModuleNode {
  nodeType: "export"
  exportType: string
  identifier: string
}

const moduleExport = map(
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

const isExport = (x: ASTFunction | ASTExport): x is ASTExport =>
  x.nodeType === "export"
const isFunc = (x: ASTFunction | ASTExport): x is ASTFunction =>
  x.nodeType === "func"

export const moduleParser = map(
  seq(keyword("module"), many(or(array(moduleExport), array(func)))),
  r =>
    ({
      nodeType: "module",
      functions: r[1].filter(isFunc),
      exports: r[1].filter(isExport)
    } as ASTModule)
)
