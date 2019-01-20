import { func } from "./func"
import { seq, or, map, many } from "../parser/parser"
import { keyword, array } from "./utils"
import { moduleExport } from "./export"
import { moduleGlobal } from "./global"
import { moduleMemory } from "./memory"
import { moduleTable } from "./table"
import { moduleType } from "./type"
import { moduleElem } from "./elem"
import { Element } from "../s-parser/s-parser"
import {
  ASTModuleNode,
  ASTModule,
  ASTExport,
  ASTFunction,
  ASTGlobal,
  ASTMemory,
  ASTTable,
  ASTType,
  ASTElem
} from "../ast/module"

const isExport = (x: ASTModuleNode): x is ASTExport => x.nodeType === "export"
const isFunc = (x: ASTModuleNode): x is ASTFunction => x.nodeType === "func"
const isGlobal = (x: ASTModuleNode): x is ASTGlobal => x.nodeType === "global"
const isMemory = (x: ASTModuleNode): x is ASTMemory => x.nodeType === "memory"
const isTable = (x: ASTModuleNode): x is ASTTable => x.nodeType === "table"
const isType = (x: ASTModuleNode): x is ASTType => x.nodeType === "type"
const isElem = (x: ASTModuleNode): x is ASTElem => x.nodeType === "elem"

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
      types: r[1].filter(isType),
      elems: r[1].filter(isElem)
    } as ASTModule)
)
