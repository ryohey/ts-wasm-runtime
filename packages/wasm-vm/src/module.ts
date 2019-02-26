import { ValType, NumberValue, Op } from "@ryohey/wasm-ast"

export interface WASMElem {
  offset: number
  funcIds: number[]
}

export interface WASMGlobal {
  type: ValType
  mutable: boolean
  initialValue: NumberValue
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
