import { ValType, Int32Value, NumberValue, Op } from "@ryohey/wasm-ast"

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
  body: Op.Any[]
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
  initialValue: NumberValue
}

export interface WATElem {
  nodeType: "elem"
  offset: Int32Value
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
}
