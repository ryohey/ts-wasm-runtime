import { ValType, Op } from "@ryohey/wasm-ast"

export interface WASMElem {
  offset: Op.Initializer
  funcIds: number[]
}

export interface WASMGlobal {
  type: ValType
  mutable: boolean
  init: Op.Initializer
}

export interface WASMFunction {
  export: string | null
  parameters: ValType[]
  results: ValType[]
  body: Op.Any[]
  locals: ValType[]
}

export interface WASMModule {
  functions: WASMFunction[]
  elems: WASMElem[]
  globals: WASMGlobal[]
}
