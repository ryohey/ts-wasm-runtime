import {
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value,
  ValType
} from "./number"

export interface Base<T extends string> {
  opType: T
}

export interface Nop extends Base<"nop"> {}
export interface Unreachable extends Base<"unreachable"> {}
export interface Return extends Base<"return"> {}
export interface Memory_grow extends Base<"memory.grow"> {}
export interface Memory_size extends Base<"memory.size"> {}

export interface Param1<S extends string, T> extends Base<S> {
  parameter: T
}

export interface ParamMany<S extends string, T> extends Base<S> {
  parameters: T[]
}

export interface Br extends Param1<"br", number | string> {}
export interface BrIf extends Param1<"br_if", number | string> {}
export interface BrTable extends ParamMany<"br_table", number | string> {}

export interface Call extends Param1<"call", number | string> {}
export interface CallIndirect extends Base<"call_indirect"> {}
export interface Drop extends Base<"drop"> {}
export interface Select extends Base<"select"> {}

export interface Local_get extends Param1<"local.get", number | string> {}
export interface Local_set extends Param1<"local.set", number | string> {}
export interface Get_local extends Param1<"get_local", number | string> {}
export interface Set_local extends Param1<"set_local", number | string> {}

export interface Local_tee extends Param1<"local.tee", number | string> {}
export interface Tee_local extends Param1<"tee_local", number | string> {}

export interface Global_get extends Param1<"global.get", number | string> {}
export interface Global_set extends Param1<"global.set", number | string> {}
export interface Get_global extends Param1<"get_global", number | string> {}
export interface Set_global extends Param1<"set_global", number | string> {}

export interface I32_const extends Param1<"i32.const", Int32Value> {}
export interface I64_const extends Param1<"i64.const", Int64Value> {}
export interface F32_const extends Param1<"f32.const", Float32Value> {}
export interface F64_const extends Param1<"f64.const", Float64Value> {}

export interface I32_add extends Base<"i32.add"> {}
export interface I64_add extends Base<"i64.add"> {}
export interface F32_add extends Base<"f32.add"> {}
export interface F64_add extends Base<"f64.add"> {}

export interface I32_sub extends Base<"i32.sub"> {}
export interface I64_sub extends Base<"i64.sub"> {}
export interface F32_sub extends Base<"f32.sub"> {}
export interface F64_sub extends Base<"f64.sub"> {}

export interface I32_mul extends Base<"i32.mul"> {}
export interface I64_mul extends Base<"i64.mul"> {}
export interface F32_mul extends Base<"f32.mul"> {}
export interface F64_mul extends Base<"f64.mul"> {}

export interface F32_div extends Base<"f32.div"> {}
export interface F64_div extends Base<"f64.div"> {}

export interface I32_div_s extends Base<"i32.div_s"> {}
export interface I64_div_s extends Base<"i64.div_s"> {}

export interface I32_div_u extends Base<"i32.div_u"> {}
export interface I64_div_u extends Base<"i64.div_u"> {}

export interface I32_rem_s extends Base<"i32.rem_s"> {}
export interface I64_rem_s extends Base<"i64.rem_s"> {}

export interface I32_rem_u extends Base<"i32.rem_u"> {}
export interface I64_rem_u extends Base<"i64.rem_u"> {}

export interface I32_and extends Base<"i32.and"> {}
export interface I64_and extends Base<"i64.and"> {}

export interface I32_or extends Base<"i32.or"> {}
export interface I64_or extends Base<"i64.or"> {}

export interface I32_xor extends Base<"i32.xor"> {}
export interface I64_xor extends Base<"i64.xor"> {}

export interface I32_shl extends Base<"i32.shl"> {}
export interface I64_shl extends Base<"i64.shl"> {}

export interface I32_shr_s extends Base<"i32.shr_s"> {}
export interface I64_shr_s extends Base<"i64.shr_s"> {}

export interface I32_shr_u extends Base<"i32.shr_u"> {}
export interface I64_shr_u extends Base<"i64.shr_u"> {}

export interface I32_rotl extends Base<"i32.rotl"> {}
export interface I64_rotl extends Base<"i64.rotl"> {}

export interface I32_rotr extends Base<"i32.rotr"> {}
export interface I64_rotr extends Base<"i64.rotr"> {}

export interface I32_eq extends Base<"i32.eq"> {}
export interface I64_eq extends Base<"i64.eq"> {}
export interface F32_eq extends Base<"f32.eq"> {}
export interface F64_eq extends Base<"f64.eq"> {}

export interface I32_ne extends Base<"i32.ne"> {}
export interface I64_ne extends Base<"i64.ne"> {}
export interface F32_ne extends Base<"f32.ne"> {}
export interface F64_ne extends Base<"f64.ne"> {}

export interface I32_lt_s extends Base<"i32.lt_s"> {}
export interface I64_lt_s extends Base<"i64.lt_s"> {}

export interface I32_lt_u extends Base<"i32.lt_u"> {}
export interface I64_lt_u extends Base<"i64.lt_u"> {}

export interface F32_lt extends Base<"f32.lt"> {}
export interface F64_lt extends Base<"f64.lt"> {}

export interface I32_le_s extends Base<"i32.le_s"> {}
export interface I64_le_s extends Base<"i64.le_s"> {}

export interface I32_le_u extends Base<"i32.le_u"> {}
export interface I64_le_u extends Base<"i64.le_u"> {}

export interface F32_le extends Base<"f32.le"> {}
export interface F64_le extends Base<"f64.le"> {}

export interface I32_gt_s extends Base<"i32.gt_s"> {}
export interface I64_gt_s extends Base<"i64.gt_s"> {}

export interface I32_gt_u extends Base<"i32.gt_u"> {}
export interface I64_gt_u extends Base<"i64.gt_u"> {}

export interface F32_gt extends Base<"f32.gt"> {}
export interface F64_gt extends Base<"f64.gt"> {}

export interface I32_ge_s extends Base<"i32.ge_s"> {}
export interface I64_ge_s extends Base<"i64.ge_s"> {}

export interface I32_ge_u extends Base<"i32.ge_u"> {}
export interface I64_ge_u extends Base<"i64.ge_u"> {}

export interface F32_ge extends Base<"f32.ge"> {}
export interface F64_ge extends Base<"f64.ge"> {}

export interface I32_clz extends Base<"i32.clz"> {}
export interface I64_clz extends Base<"i64.clz"> {}

export interface I32_ctz extends Base<"i32.ctz"> {}
export interface I64_ctz extends Base<"i64.ctz"> {}

export interface I32_popcnt extends Base<"i32.popcnt"> {}
export interface I64_popcnt extends Base<"i64.popcnt"> {}

export interface I32_eqz extends Base<"i32.eqz"> {}
export interface I64_eqz extends Base<"i64.eqz"> {}

export interface F32_abs extends Base<"f32.abs"> {}
export interface F64_abs extends Base<"f64.abs"> {}

export interface F32_neg extends Base<"f32.neg"> {}
export interface F64_neg extends Base<"f64.neg"> {}

export interface F32_copysign extends Base<"f32.copysign"> {}
export interface F64_copysign extends Base<"f64.copysign"> {}

export interface F32_ceil extends Base<"f32.ceil"> {}
export interface F64_ceil extends Base<"f64.ceil"> {}

export interface F32_floor extends Base<"f32.floor"> {}
export interface F64_floor extends Base<"f64.floor"> {}

export interface F32_trunc extends Base<"f32.trunc"> {}
export interface F64_trunc extends Base<"f64.trunc"> {}

export interface F32_nearest extends Base<"f32.nearest"> {}
export interface F64_nearest extends Base<"f64.nearest"> {}

export interface F32_sqrt extends Base<"f32.sqrt"> {}
export interface F64_sqrt extends Base<"f64.sqrt"> {}

export interface F32_min extends Base<"f32.min"> {}
export interface F64_min extends Base<"f64.min"> {}

export interface F32_max extends Base<"f32.max"> {}
export interface F64_max extends Base<"f64.max"> {}

export interface I32_wrap_i64 extends Base<"i32.wrap/i64"> {}

export interface I32_trunc_f32_s extends Base<"i32.trunc_f32_s"> {}
export interface I32_trunc_f64_s extends Base<"i32.trunc_f64_s"> {}
export interface I32_trunc_f32_u extends Base<"i32.trunc_f32_u"> {}
export interface I32_trunc_f64_u extends Base<"i32.trunc_f64_u"> {}

export interface I64_extend_i32_s extends Base<"i64.extend_i32_s"> {}
export interface I64_extend_i32_u extends Base<"i64.extend_i32_u"> {}

export interface I64_trunc_f32_s extends Base<"i64.trunc_f32_s"> {}
export interface I64_trunc_f64_s extends Base<"i64.trunc_f64_s"> {}
export interface I64_trunc_f32_u extends Base<"i64.trunc_f32_u"> {}
export interface I64_trunc_f64_u extends Base<"i64.trunc_f64_u"> {}

export interface I32_reinterpret_f32 extends Base<"i32.reinterpret/f32"> {}
export interface I64_reinterpret_f64 extends Base<"i64.reinterpret/f64"> {}
export interface F32_reinterpret_i32 extends Base<"f32.reinterpret/i32"> {}
export interface F64_reinterpret_i64 extends Base<"f64.reinterpret/i64"> {}

export interface F32_demote_f64 extends Base<"f32.demote/f64"> {}

export interface F32_convert_i32_s extends Base<"f32.convert_i32_s"> {}
export interface F32_convert_i64_s extends Base<"f32.convert_i64_s"> {}
export interface F32_convert_i32_u extends Base<"f32.convert_i32_u"> {}
export interface F32_convert_i64_u extends Base<"f32.convert_i64_u"> {}

export interface F64_promote_f32 extends Base<"f64.promote/f32"> {}

export interface F64_convert_i32_s extends Base<"f64.convert_i32_s"> {}
export interface F64_convert_i64_s extends Base<"f64.convert_i64_s"> {}
export interface F64_convert_i32_u extends Base<"f64.convert_i32_u"> {}
export interface F64_convert_i64_u extends Base<"f64.convert_i64_u"> {}

interface Load<T extends string> extends Base<T> {
  align: number
  offset: number
}

export interface I32_load extends Load<"i32.load"> {}
export interface I64_load extends Load<"i64.load"> {}
export interface F32_load extends Load<"f32.load"> {}
export interface F64_load extends Load<"f64.load"> {}

export interface I32_load8_s extends Base<"i32.load8_s"> {}
export interface I32_load8_u extends Base<"i32.load8_u"> {}
export interface I32_load16_s extends Base<"i32.load16_s"> {}
export interface I32_load16_u extends Base<"i32.load16_u"> {}
export interface I64_load8_s extends Base<"i64.load8_s"> {}
export interface I64_load8_u extends Base<"i64.load8_u"> {}
export interface I64_load16_s extends Base<"i64.load16_s"> {}
export interface I64_load16_u extends Base<"i64.load16_u"> {}
export interface I64_load32_s extends Base<"i64.load32s"> {}
export interface I64_load32_u extends Base<"i64.load32_u"> {}
export interface F32_load8_s extends Base<"f32.load8_s"> {}
export interface F32_load8_u extends Base<"f32.load8_u"> {}
export interface F32_load16_s extends Base<"f32.load16_s"> {}
export interface F32_load16_u extends Base<"f32.load16_u"> {}
export interface F64_load8_s extends Base<"f64.load8_s"> {}
export interface F64_load8_u extends Base<"f64.load8_u"> {}
export interface F64_load16_s extends Base<"f64.load16_s"> {}
export interface F64_load16_u extends Base<"f64.load16_u"> {}
export interface I32_store extends Base<"i32.store"> {}
export interface I64_store extends Base<"i64.store"> {}
export interface F32_store extends Base<"f32.store"> {}
export interface F64_store extends Base<"f64.store"> {}
export interface I32_store8 extends Base<"i32.store8"> {}
export interface I32_store16 extends Base<"i32.store16"> {}
export interface I64_store8 extends Base<"i64.store8"> {}
export interface I64_store16 extends Base<"i64.store16"> {}
export interface I64_store32 extends Base<"i64.store32"> {}

export interface BlockBase<T extends string> extends Base<T> {
  identifier: string | null
  results: ValType[]
  body: Any[]
}

export interface Block extends BlockBase<"block"> {}

export interface Loop extends BlockBase<"loop"> {}

export interface If extends Base<"if"> {
  identifier: string | null
  results: ValType[]
  then: Any[]
  else: Any[]
}

export type Const = I32_const | I64_const | F32_const | F64_const

// https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#instantiation-time-initializers
export type Initializer = Const | Global_get | Get_global

export type Any =
  | Nop
  | Unreachable
  | Return
  | Br
  | BrIf
  | BrTable
  | Call
  | CallIndirect
  | Block
  | Loop
  | If
  | Memory_grow
  | Memory_size
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
  | Drop
  | Select
  | Const
  | I32_add
  | I64_add
  | F32_add
  | F64_add
  | I32_sub
  | I64_sub
  | F32_sub
  | F64_sub
  | I32_mul
  | I64_mul
  | F32_mul
  | F64_mul
  | F32_div
  | F64_div
  | I32_div_s
  | I32_div_u
  | I64_div_s
  | I64_div_u
  | I32_rem_s
  | I32_rem_u
  | I64_rem_s
  | I64_rem_u
  | I32_and
  | I64_and
  | I32_or
  | I64_or
  | I32_xor
  | I64_xor
  | I32_shl
  | I64_shl
  | I32_shr_s
  | I64_shr_s
  | I32_shr_u
  | I64_shr_u
  | I32_rotl
  | I64_rotl
  | I32_rotr
  | I64_rotr
  | I32_eq
  | I64_eq
  | F32_eq
  | F64_eq
  | I32_ne
  | I64_ne
  | F32_ne
  | F64_ne
  | I32_lt_s
  | I64_lt_s
  | I32_lt_u
  | I64_lt_u
  | F32_lt
  | F64_lt
  | I32_le_s
  | I64_le_s
  | I32_le_u
  | I64_le_u
  | F32_le
  | F64_le
  | I32_gt_s
  | I32_gt_u
  | I64_gt_s
  | I64_gt_u
  | F32_gt
  | F64_gt
  | I32_ge_s
  | I64_ge_s
  | I32_ge_u
  | I64_ge_u
  | F32_ge
  | F64_ge
  | I32_clz
  | I64_clz
  | I32_ctz
  | I64_ctz
  | I32_popcnt
  | I64_popcnt
  | I32_eqz
  | I64_eqz
  | F32_abs
  | F64_abs
  | F32_neg
  | F64_neg
  | F32_copysign
  | F64_copysign
  | F32_ceil
  | F64_ceil
  | F32_floor
  | F64_floor
  | F32_trunc
  | F64_trunc
  | F32_nearest
  | F64_nearest
  | F32_sqrt
  | F64_sqrt
  | F32_min
  | F64_min
  | F32_max
  | F64_max
  | I32_wrap_i64
  | I32_trunc_f32_s
  | I32_trunc_f64_s
  | I32_trunc_f32_u
  | I32_trunc_f64_u
  | I64_extend_i32_s
  | I64_extend_i32_u
  | I64_trunc_f32_s
  | I64_trunc_f64_s
  | I64_trunc_f32_u
  | I64_trunc_f64_u
  | I32_reinterpret_f32
  | I64_reinterpret_f64
  | F32_reinterpret_i32
  | F64_reinterpret_i64
  | F32_demote_f64
  | F32_convert_i32_s
  | F32_convert_i64_s
  | F32_convert_i32_u
  | F32_convert_i64_u
  | F64_convert_i32_s
  | F64_convert_i64_s
  | F64_convert_i32_u
  | F64_convert_i64_u
  | F64_promote_f32
  | I32_load
  | I64_load
  | F32_load
  | F64_load
  | I32_load8_s
  | I32_load8_u
  | I32_load16_s
  | I32_load16_u
  | I64_load8_s
  | I64_load8_u
  | I64_load16_s
  | I64_load16_u
  | I64_load32_s
  | I64_load32_u
  | F32_load8_s
  | F32_load8_u
  | F32_load16_s
  | F32_load16_u
  | F64_load8_s
  | F64_load8_u
  | F64_load16_s
  | F64_load16_u
  | I32_store
  | I64_store
  | F32_store
  | F64_store
  | I32_store8
  | I32_store16
  | I64_store8
  | I64_store16
  | I64_store32
