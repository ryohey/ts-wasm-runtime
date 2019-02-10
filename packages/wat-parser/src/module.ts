import { seq, or, map, many } from "@ryohey/fn-parser"
import { Element } from "@ryohey/s-parser"
import {
  ASTSection,
  ASTModule,
  ASTExport,
  ASTFunction,
  ASTGlobal,
  ASTMemory,
  ASTTable,
  ASTType,
  ASTElem
} from "@ryohey/wasm-ast"
import { func } from "./func"
import { keyword, array } from "./utils"
import { moduleExport } from "./export"
import { moduleGlobal } from "./global"
import { moduleMemory } from "./memory"
import { moduleTable } from "./table"
import { moduleType } from "./type"
import { moduleElem } from "./elem"

const isExport = (x: ASTSection): x is ASTExport => x.nodeType === "export"
const isFunc = (x: ASTSection): x is ASTFunction => x.nodeType === "func"
const isGlobal = (x: ASTSection): x is ASTGlobal => x.nodeType === "global"
const isMemory = (x: ASTSection): x is ASTMemory => x.nodeType === "memory"
const isTable = (x: ASTSection): x is ASTTable => x.nodeType === "table"
const isType = (x: ASTSection): x is ASTType => x.nodeType === "type"
const isElem = (x: ASTSection): x is ASTElem => x.nodeType === "elem"

export const moduleParser = map(
  seq(
    keyword("module"),
    many(
      or<Element[], ASTSection>(
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
