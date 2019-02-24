import { seq, or, map, many } from "@ryohey/fn-parser"
import { Element } from "@ryohey/s-parser"
import { func } from "./func"
import { keyword, array } from "./utils"
import { moduleExport } from "./export"
import { moduleGlobal } from "./global"
import { moduleMemory } from "./memory"
import { moduleTable } from "./table"
import { moduleType } from "./type"
import { moduleElem } from "./elem"
import {
  WATSection,
  WATExport,
  WATFunction,
  WATGlobal,
  WATMemory,
  WATTable,
  WATType,
  WATElem,
  WATModule
} from "./moduleTypes"

const isExport = (x: WATSection): x is WATExport => x.nodeType === "export"
const isFunc = (x: WATSection): x is WATFunction => x.nodeType === "func"
const isGlobal = (x: WATSection): x is WATGlobal => x.nodeType === "global"
const isMemory = (x: WATSection): x is WATMemory => x.nodeType === "memory"
const isTable = (x: WATSection): x is WATTable => x.nodeType === "table"
const isType = (x: WATSection): x is WATType => x.nodeType === "type"
const isElem = (x: WATSection): x is WATElem => x.nodeType === "elem"

export const moduleParser = map(
  seq(
    keyword("module"),
    many(
      or<Element[], WATSection>(
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
    } as WATModule)
)
