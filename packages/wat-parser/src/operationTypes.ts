import { Op, ValType } from "@ryohey/wasm-ast"
import { Int32String, Int64String, Float32String, Float64String } from "./types"

export interface I32_const extends Op.Param1<"text.i32.const", Int32String> {}
export interface I64_const extends Op.Param1<"text.i64.const", Int64String> {}
export interface F32_const extends Op.Param1<"text.f32.const", Float32String> {}
export interface F64_const extends Op.Param1<"text.f64.const", Float64String> {}

export interface Br extends Op.Param1<"text.br", number | string> {}
export interface BrIf extends Op.Param1<"text.br_if", number | string> {}
export interface BrTable
  extends Op.ParamMany<"text.br_table", number | string> {}

export interface Call extends Op.Param1<"text.call", number | string> {}

export interface Local_get
  extends Op.Param1<"text.local.get", number | string> {}
export interface Local_set
  extends Op.Param1<"text.local.set", number | string> {}
export interface Get_local
  extends Op.Param1<"text.get_local", number | string> {}
export interface Set_local
  extends Op.Param1<"text.set_local", number | string> {}
export interface Local_tee
  extends Op.Param1<"text.local.tee", number | string> {}
export interface Tee_local
  extends Op.Param1<"text.tee_local", number | string> {}
export interface Global_get
  extends Op.Param1<"text.global.get", number | string> {}
export interface Global_set
  extends Op.Param1<"text.global.set", number | string> {}
export interface Get_global
  extends Op.Param1<"text.get_global", number | string> {}
export interface Set_global
  extends Op.Param1<"text.set_global", number | string> {}

export interface BlockBase<T extends string> extends Op.Base<T> {
  identifier: string | null
  results: ValType[]
  body: Any[]
}

export interface Block extends BlockBase<"text.block"> {}

export interface Loop extends BlockBase<"text.loop"> {}

export interface If extends Op.Base<"text.if"> {
  identifier: string | null
  results: ValType[]
  then: Any[]
  else: Any[]
}

export type Const = I32_const | I64_const | F32_const | F64_const

export type Initializer = Const | Global_get | Get_global

export type Any =
  | Op.Any
  | Const
  | Br
  | BrIf
  | BrTable
  | Call
  | Local_get
  | Local_set
  | Get_local
  | Set_local
  | Local_tee
  | Tee_local
  | Global_get
  | Global_set
  | Get_global
  | Set_global
  | Block
  | Loop
  | If
