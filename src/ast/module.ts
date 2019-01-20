import { ValType, Int32Value } from "./number"
import * as Op from "./instructions"

export interface ASTModule {
  nodeType: "module"
  functions: ASTFunction[]
  exports: ASTExport[]
  globals: ASTGlobal[]
  memories: ASTMemory[]
  tables: ASTTable[]
  types: ASTType[]
  elems: ASTElem[]
}

export type ASTModuleNode =
  | ASTFunction
  | ASTExport
  | ASTGlobal
  | ASTMemory
  | ASTTable
  | ASTType
  | ASTElem

export interface ASTFunction {
  nodeType: "func"
  identifier: string | null
  export: string | null
  parameters: ASTFunctionParameter[]
  results: ValType[]
  body: Op.Any[]
  locals: ASTFunctionLocal[]
}

export interface ASTFunctionParameter {
  identifier: string | null
  type: ValType
}
export interface ASTFunctionLocal {
  identifier: string | null
  type: ValType
}

export interface ASTGlobal {
  nodeType: "global"
  identifier: string | null
  export: string | null
  type: ValType
  mutable: boolean
}

export interface ASTElem {
  nodeType: "elem"
  offset: Int32Value
  funcIds: (number | string)[]
}

export interface ASTExport {
  nodeType: "export"
  exportType: string
  identifier: string
}

export interface ASTMemory {
  nodeType: "memory"
  identifier: string | null
  export: string | null
}

export interface ASTTable {
  nodeType: "table"
  identifier: string | null
  export: string | null
}

export interface ASTType {
  nodeType: "type"
  identifier: string | null
}
