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

type ASTModuleElement =
  | ASTFunction
  | ASTExport
  | ASTGlobal
  | ASTMemory
  | ASTTable
  | ASTType
  | ASTElem

const isExport = (x: ASTModuleElement): x is ASTExport =>
  x.nodeType === "export"
const isFunc = (x: ASTModuleElement): x is ASTFunction => x.nodeType === "func"
const isGlobal = (x: ASTModuleElement): x is ASTGlobal =>
  x.nodeType === "global"
const isMemory = (x: ASTModuleElement): x is ASTMemory =>
  x.nodeType === "memory"
const isTable = (x: ASTModuleElement): x is ASTTable => x.nodeType === "table"
const isType = (x: ASTModuleElement): x is ASTType => x.nodeType === "type"

export const moduleParser = map(
  seq(
    keyword("module"),
    many(
      or<Element[], ASTModuleElement>(
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
