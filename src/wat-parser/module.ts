import { ASTFunction, func } from "./func"
import { seq, or, map, many } from "../parser/parser"
import { keyword, array } from "./utils"
import { ASTExport, moduleExport } from "./export"
import { ASTGlobal, moduleGlobal } from "./global"
import { moduleMemory, ASTMemory } from "./memory"
import { ASTTable, moduleTable } from "./table"
import { moduleType, ASTType } from "./type"
import { moduleElem, ASTElem } from "./elem"
import { Element } from "../s-parser/s-parser"

export interface ASTModule {
  nodeType: "module"
  functions: ASTFunction[]
  exports: ASTExport[]
  globals: ASTGlobal[]
  memories: ASTMemory[]
  tables: ASTTable[]
  types: ASTType[]
}

export type ASTModuleNode =
  | ASTFunction
  | ASTExport
  | ASTGlobal
  | ASTMemory
  | ASTTable
  | ASTType
  | ASTElem

const isExport = (x: ASTModuleNode): x is ASTExport => x.nodeType === "export"
const isFunc = (x: ASTModuleNode): x is ASTFunction => x.nodeType === "func"
const isGlobal = (x: ASTModuleNode): x is ASTGlobal => x.nodeType === "global"
const isMemory = (x: ASTModuleNode): x is ASTMemory => x.nodeType === "memory"
const isTable = (x: ASTModuleNode): x is ASTTable => x.nodeType === "table"
const isType = (x: ASTModuleNode): x is ASTType => x.nodeType === "type"

export const moduleParser = map(
  seq(
    keyword("module"),
    many(
      or<Element[], ASTModuleNode>(
        array(moduleExport),
        array(func),
        array(moduleGlobal),
        array(moduleMemory),
        array(moduleTable),
        array(moduleType),
        array(moduleElem)
      )
    )
  ),
  r =>
    ({
      nodeType: "module",
      functions: r[1].filter(isFunc),
      exports: r[1].filter(isExport),
      globals: r[1].filter(isGlobal),
      memories: r[1].filter(isMemory),
      tables: r[1].filter(isTable),
      types: r[1].filter(isType)
    } as ASTModule)
)
