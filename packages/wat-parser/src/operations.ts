import { or, seq, many, map, Parser, lazy, opt } from "@ryohey/fn-parser"
import { Element } from "@ryohey/s-parser"
import { Op } from "@ryohey/wasm-ast"
import { keyword, array, regexp } from "./utils"
import {
  int32,
  int64,
  float32,
  float64,
  indices,
  num,
  identifier
} from "./types"
import { blockInstructions } from "./block"
import { flatten } from "@ryohey/array-helper"
import { ifParser } from "./if"
import * as TextOp from "./operationTypes"

// operation with no parameters
const op = <T extends Op.Any>(str: T["opType"]): Parser<Element[], T> =>
  map(
    keyword(str),
    _ =>
      ({
        opType: str
      } as T)
  )

// operation with single parameter
const _op1 = <T extends Op.Param1<string, any>>(
  opType: T["opType"],
  str: string,
  parser: Parser<Element[], T["parameter"]>
): Parser<Element[], T> =>
  map(
    seq(keyword(str), parser),
    r =>
      ({
        opType,
        parameter: r[1]
      } as T)
  )

const op1 = <T extends Op.Param1<string, any>>(
  str: T["opType"],
  parser: Parser<Element[], T["parameter"]>
) => _op1(str, str, parser)

const _opN = <T extends Op.ParamMany<string, any>>(
  opType: T["opType"],
  str: string,
  parser: Parser<Element[], T["parameters"][0]>
): Parser<Element[], T> =>
  map(
    seq(keyword(str), many(parser)),
    r =>
      ({
        opType,
        parameters: r[1]
      } as T)
  )

const opN = <T extends Op.ParamMany<string, any>>(
  str: T["opType"],
  parser: Parser<Element[], T["parameters"][0]>
): Parser<Element[], T> =>
  map(
    seq(keyword(str), many(parser)),
    r =>
      ({
        opType: str,
        parameters: r[1]
      } as T)
  )

export const attr = (str: string) =>
  map(regexp(new RegExp(`^${str}=([0-9]+)`)), r => parseInt(r, 10))

const memOp = <S extends Op.Mem<any>>(str: S["opType"]) =>
  map(
    seq(keyword(str), opt(attr("offset")), opt(attr("align"))),
    r =>
      ({
        opType: r[0],
        offset: r[1],
        align: r[2]
      } as S)
  )

export const constInstructions = or(
  op1<Op.I32_const>("i32.const", int32),
  op1<Op.I64_const>("i64.const", int64),
  op1<Op.F32_const>("f32.const", float32),
  op1<Op.F64_const>("f64.const", float64)
)

const getGlobal = or(
  op1<Op.Get_global>("get_global", num),
  _op1<TextOp.Get_global>("text.get_global", "get_global", identifier)
)

const globalGet = or(
  op1<Op.Global_get>("global.get", num),
  _op1<TextOp.Global_get>("text.global.get", "global.get", identifier)
)

export const initializerInstructions = or(
  constInstructions,
  getGlobal,
  globalGet
)

export const plainInstructions = or<Element[], TextOp.Any>(
  constInstructions,

  op<Op.Nop>("nop"),
  op<Op.Unreachable>("unreachable"),

  op1<Op.Br>("br", num),
  _op1<TextOp.Br>("text.br", "br", identifier),

  op1<Op.BrIf>("br_if", num),
  _op1<TextOp.BrIf>("text.br_if", "br_if", identifier),

  opN<Op.BrTable>("br_table", num),
  _opN<TextOp.BrTable>("text.br_table", "br_table", identifier),

  op1<Op.Call>("call", num),
  _op1<TextOp.Call>("text.call", "call", identifier),

  op<Op.CallIndirect>("call_indirect"),
  op<Op.Drop>("drop"),
  op<Op.Select>("select"),
  op<Op.Return>("return"),

  op1<Op.Local_get>("local.get", num),
  _op1<TextOp.Local_get>("text.local.get", "local.get", identifier),

  op1<Op.Local_set>("local.set", num),
  _op1<TextOp.Local_set>("text.local.set", "local.set", identifier),

  op1<Op.Get_local>("get_local", num),
  _op1<TextOp.Get_local>("text.get_local", "get_local", identifier),

  op1<Op.Set_local>("set_local", num),
  _op1<TextOp.Set_local>("text.set_local", "set_local", identifier),

  op1<Op.Local_tee>("local.tee", num),
  _op1<TextOp.Local_tee>("text.local.tee", "local.tee", identifier),

  op1<Op.Tee_local>("tee_local", num),
  _op1<TextOp.Tee_local>("text.tee_local", "tee_local", identifier),

  globalGet,
  getGlobal,

  op1<Op.Global_set>("global.set", num),
  _op1<TextOp.Global_set>("text.global.set", "global.set", identifier),

  op1<Op.Set_global>("set_global", num),
  _op1<TextOp.Set_global>("text.set_global", "set_global", identifier),

  op<Op.I32_add>("i32.add"),
  op<Op.I64_add>("i64.add"),
  op<Op.F32_add>("f32.add"),
  op<Op.F64_add>("f64.add"),

  op<Op.I32_sub>("i32.sub"),
  op<Op.I64_sub>("i64.sub"),
  op<Op.F32_sub>("f32.sub"),
  op<Op.F64_sub>("f64.sub"),

  op<Op.I32_mul>("i32.mul"),
  op<Op.I64_mul>("i64.mul"),
  op<Op.F32_mul>("f32.mul"),
  op<Op.F64_mul>("f64.mul"),

  op<Op.F32_div>("f32.div"),
  op<Op.F64_div>("f64.div"),

  op<Op.I32_div_s>("i32.div_s"),
  op<Op.I64_div_s>("i64.div_s"),

  op<Op.I32_div_u>("i32.div_u"),
  op<Op.I64_div_u>("i64.div_u"),

  op<Op.I32_rem_s>("i32.rem_s"),
  op<Op.I64_rem_s>("i64.rem_s"),

  op<Op.I32_rem_u>("i32.rem_u"),
  op<Op.I64_rem_u>("i64.rem_u"),

  op<Op.I32_and>("i32.and"),
  op<Op.I64_and>("i64.and"),

  op<Op.I32_or>("i32.or"),
  op<Op.I64_or>("i64.or"),

  op<Op.I32_xor>("i32.xor"),
  op<Op.I64_xor>("i64.xor"),

  op<Op.I32_shl>("i32.shl"),
  op<Op.I64_shl>("i64.shl"),

  op<Op.I32_shr_s>("i32.shr_s"),
  op<Op.I64_shr_s>("i64.shr_s"),

  op<Op.I32_shr_u>("i32.shr_u"),
  op<Op.I64_shr_u>("i64.shr_u"),

  op<Op.I32_rotl>("i32.rotl"),
  op<Op.I64_rotl>("i64.rotl"),

  op<Op.I32_rotr>("i32.rotr"),
  op<Op.I64_rotr>("i64.rotr"),

  op<Op.I32_eq>("i32.eq"),
  op<Op.I64_eq>("i64.eq"),
  op<Op.F32_eq>("f32.eq"),
  op<Op.F64_eq>("f64.eq"),

  op<Op.I32_ne>("i32.ne"),
  op<Op.I64_ne>("i64.ne"),
  op<Op.F32_ne>("f32.ne"),
  op<Op.F64_ne>("f64.ne"),

  op<Op.I32_lt_s>("i32.lt_s"),
  op<Op.I64_lt_s>("i64.lt_s"),

  op<Op.I32_lt_u>("i32.lt_u"),
  op<Op.I64_lt_u>("i64.lt_u"),

  op<Op.F32_lt>("f32.lt"),
  op<Op.F64_lt>("f64.lt"),

  op<Op.I32_le_s>("i32.le_s"),
  op<Op.I64_le_s>("i64.le_s"),

  op<Op.I32_le_u>("i32.le_u"),
  op<Op.I64_le_u>("i64.le_u"),

  op<Op.F32_le>("f32.le"),
  op<Op.F64_le>("f64.le"),

  op<Op.I32_gt_s>("i32.gt_s"),
  op<Op.I64_gt_s>("i64.gt_s"),

  op<Op.I32_gt_u>("i32.gt_u"),
  op<Op.I64_gt_u>("i64.gt_u"),

  op<Op.F32_gt>("f32.gt"),
  op<Op.F64_gt>("f64.gt"),

  op<Op.I32_ge_s>("i32.ge_s"),
  op<Op.I64_ge_s>("i64.ge_s"),

  op<Op.I32_ge_u>("i32.ge_u"),
  op<Op.I64_ge_u>("i64.ge_u"),

  op<Op.F32_ge>("f32.ge"),
  op<Op.F64_ge>("f64.ge"),

  op<Op.I32_clz>("i32.clz"),
  op<Op.I64_clz>("i64.clz"),

  op<Op.I32_ctz>("i32.ctz"),
  op<Op.I64_ctz>("i64.ctz"),

  op<Op.I32_popcnt>("i32.popcnt"),
  op<Op.I64_popcnt>("i64.popcnt"),

  op<Op.I32_eqz>("i32.eqz"),
  op<Op.I64_eqz>("i64.eqz"),

  op<Op.F32_abs>("f32.abs"),
  op<Op.F64_abs>("f64.abs"),

  op<Op.F32_neg>("f32.neg"),
  op<Op.F64_neg>("f64.neg"),

  op<Op.F32_copysign>("f32.copysign"),
  op<Op.F64_copysign>("f64.copysign"),

  op<Op.F32_ceil>("f32.ceil"),
  op<Op.F64_ceil>("f64.ceil"),

  op<Op.F32_floor>("f32.floor"),
  op<Op.F64_floor>("f64.floor"),

  op<Op.F32_trunc>("f32.trunc"),
  op<Op.F64_trunc>("f64.trunc"),

  op<Op.F32_nearest>("f32.nearest"),
  op<Op.F64_nearest>("f64.nearest"),

  op<Op.F32_sqrt>("f32.sqrt"),
  op<Op.F64_sqrt>("f64.sqrt"),

  op<Op.F32_min>("f32.min"),
  op<Op.F64_min>("f64.min"),

  op<Op.F32_max>("f32.max"),
  op<Op.F64_max>("f64.max"),

  op<Op.I32_wrap_i64>("i32.wrap/i64"),

  op<Op.I32_trunc_f32_s>("i32.trunc_f32_s"),
  op<Op.I32_trunc_f64_s>("i32.trunc_f64_s"),
  op<Op.I32_trunc_f32_u>("i32.trunc_f32_u"),
  op<Op.I32_trunc_f64_u>("i32.trunc_f64_u"),

  op<Op.I64_extend_i32_s>("i64.extend_i32_s"),
  op<Op.I64_extend_i32_u>("i64.extend_i32_u"),

  op<Op.I64_trunc_f32_s>("i64.trunc_f32_s"),
  op<Op.I64_trunc_f64_s>("i64.trunc_f64_s"),
  op<Op.I64_trunc_f32_u>("i64.trunc_f32_u"),
  op<Op.I64_trunc_f64_u>("i64.trunc_f64_u"),

  op<Op.I32_reinterpret_f32>("i32.reinterpret/f32"),
  op<Op.I64_reinterpret_f64>("i64.reinterpret/f64"),
  op<Op.F32_reinterpret_i32>("f32.reinterpret/i32"),
  op<Op.F64_reinterpret_i64>("f64.reinterpret/i64"),

  op<Op.F32_demote_f64>("f32.demote/f64"),

  op<Op.F32_convert_i32_s>("f32.convert_i32_s"),
  op<Op.F32_convert_i64_s>("f32.convert_i64_s"),
  op<Op.F32_convert_i32_u>("f32.convert_i32_u"),
  op<Op.F32_convert_i64_u>("f32.convert_i64_u"),

  op<Op.F64_promote_f32>("f64.promote/f32"),

  op<Op.F64_convert_i32_s>("f64.convert_i32_s"),
  op<Op.F64_convert_i64_s>("f64.convert_i64_s"),
  op<Op.F64_convert_i32_u>("f64.convert_i32_u"),
  op<Op.F64_convert_i64_u>("f64.convert_i64_u"),

  memOp<Op.I32_load>("i32.load"),
  memOp<Op.I64_load>("i64.load"),
  memOp<Op.F32_load>("f32.load"),
  memOp<Op.F64_load>("f64.load"),

  memOp<Op.I32_load8_u>("i32.load8_u"),
  memOp<Op.I32_load8_s>("i32.load8_s"),
  memOp<Op.I32_load16_s>("i32.load16_s"),
  memOp<Op.I32_load16_u>("i32.load16_u"),

  memOp<Op.I64_load8_s>("i64.load8_s"),
  memOp<Op.I64_load8_u>("i64.load8_u"),
  memOp<Op.I64_load16_s>("i64.load16_s"),
  memOp<Op.I64_load16_u>("i64.load16_u"),
  memOp<Op.I64_load32_s>("i64.load32_s"),
  memOp<Op.I64_load32_u>("i64.load32_u"),

  memOp<Op.F32_load8_s>("f32.load8_s"),
  memOp<Op.F32_load8_u>("f32.load8_u"),
  memOp<Op.F32_load16_s>("f32.load16_s"),
  memOp<Op.F32_load16_u>("f32.load16_u"),

  memOp<Op.F64_load8_s>("f64.load8_s"),
  memOp<Op.F64_load8_u>("f64.load8_u"),
  memOp<Op.F64_load16_s>("f64.load16_s"),
  memOp<Op.F64_load16_u>("f64.load16_u"),

  memOp<Op.I32_store>("i32.store"),
  memOp<Op.I64_store>("i64.store"),
  memOp<Op.F32_store>("f32.store"),
  memOp<Op.F64_store>("f64.store"),
  memOp<Op.I32_store8>("i32.store8"),
  memOp<Op.I32_store16>("i32.store16"),
  memOp<Op.I64_store8>("i64.store8"),
  memOp<Op.I64_store16>("i64.store16"),
  memOp<Op.I64_store32>("i64.store32")
)

const foldedInstructions: Parser<Element[], TextOp.Any[]> = map(
  array(
    seq(
      plainInstructions,
      opt(map(many(lazy(() => operations)), r => flatten(r)))
    )
  ),
  r => [...(r[1] ? r[1] : []), r[0]]
)

export const operations: Parser<Element[], TextOp.Any[]> = or(
  lazy(() => map(blockInstructions, r => [r])),
  lazy(() => ifParser),
  map(plainInstructions, r => [r]),
  foldedInstructions
)
