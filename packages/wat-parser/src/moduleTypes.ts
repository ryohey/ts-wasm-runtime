import { ValType } from "@ryohey/wasm-ast"
import * as TextOp from "./operationTypes"

export interface WATModule {
  nodeType: "module"
  functions: WATFunction[]
  exports: WATExport[]
  globals: WATGlobal[]
  memories: WATMemory[]
  tables: WATTable[]
  types: WATType[]
  elems: WATElem[]
}

export type WATSection =
  | WATFunction
  | WATExport
  | WATGlobal
  | WATMemory
  | WATTable
  | WATType
  | WATElem

export interface WATFunction {
  nodeType: "func"
  identifier: string | null
  export: string | null
  parameters: WATFunctionParameter[]
  results: ValType[]
  body: TextOp.Any[]
  locals: WATFunctionLocal[]
}

export interface WATFunctionParameter {
  identifier: string | null
  type: ValType
}
export interface WATFunctionLocal {
  identifier: string | null
  type: ValType
}

export interface WATGlobal {
  nodeType: "global"
  identifier: string | null
  export: string | null
  type: ValType
  mutable: boolean
  init: TextOp.Initializer
}

export interface WATElem {
  nodeType: "elem"
  offset: TextOp.Initializer
  funcIds: (number | string)[]
}

export interface WATExport {
  nodeType: "export"
  exportType: string
  identifier: string
}

export interface WATMemory {
  nodeType: "memory"
  identifier: string | null
  export: string | null
}

export interface WATTable {
  nodeType: "table"
  identifier: string | null
  export: string | null
}

export interface WATType {
  nodeType: "type"
  identifier: string | null
  parameters: WATFunctionParameter[]
  results: ValType[]
}
