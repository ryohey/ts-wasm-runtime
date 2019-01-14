import { or, seq, many, map, Parser, lazy, opt } from "../parser/parser"
import { keyword, array } from "./utils"
import { int32, int64, float32, float64, indices } from "./types"
import { ASTFunctionInstruction, AnyParameter } from "./func"
import { blockInstructions } from "./block"
import { flatten } from "../misc/array"
import { Element } from "../s-parser/s-parser"

// operation with no parameters
const op = (str: string): Parser<Element[], ASTFunctionInstruction<number>> =>
  map(keyword(str), r => ({
    opType: r,
    parameters: []
  }))

// operation with single parameter
const op1 = <T>(
  str: string,
  parser: Parser<Element[], T>
): Parser<Element[], ASTFunctionInstruction<T>> =>
  map(seq(keyword(str), parser), r => ({
    opType: r[0],
    parameters: [r[1]]
  }))

const opN = <T>(
  str: string,
  parser: Parser<Element[], T>
): Parser<Element[], ASTFunctionInstruction<T>> =>
  map(seq(keyword(str), many(parser)), r => ({
    opType: r[0],
    parameters: r[1]
  }))

export const constInstructions = or(
  op1("i32.const", int32),
  op1("i64.const", int64),
  op1("f32.const", float32),
  op1("f64.const", float64)
)

export const plainInstructions = or<
  Element[],
  ASTFunctionInstruction<AnyParameter>
>(
  constInstructions,
  op("nop"),
  op("unreachable"),
  op1("br", indices),
  op1("br_if", indices),
  opN("br_table", indices),
  op1("call", indices),
  op("call_indirect"),
  op("drop"),
  op("select"),

  op1("local.get", indices),
  op1("local.set", indices),
  op1("get_local", indices),
  op1("set_local", indices),

  op1("local.tee", indices),
  op1("tee_local", indices),

  op1("global.get", indices),
  op1("global.set", indices),
  op1("get_global", indices),
  op1("set_global", indices),

  op("i32.add"),
  op("i64.add"),
  op("f32.add"),
  op("f64.add"),

  op("i32.sub"),
  op("i64.sub"),
  op("f32.sub"),
  op("f64.sub"),

  op("i32.mul"),
  op("i64.mul"),
  op("f32.mul"),
  op("f64.mul"),

  op("f32.div"),
  op("f64.div"),

  op("i32.div_s"),
  op("i64.div_s"),

  op("i32.div_u"),
  op("i64.div_u"),

  op("i32.rem_s"),
  op("i64.rem_s"),

  op("i32.rem_u"),
  op("i64.rem_u"),

  op("i32.and"),
  op("i64.and"),

  op("i32.or"),
  op("i64.or"),

  op("i32.xor"),
  op("i64.xor"),

  op("i32.shl"),
  op("i64.shl"),

  op("i32.shr_s"),
  op("i64.shr_s"),

  op("i32.shr_u"),
  op("i64.shr_u"),

  op("i32.rot_l"),
  op("i64.rot_l"),

  op("i32.rot_r"),
  op("i64.rot_r"),

  op("i32.eq"),
  op("i64.eq"),
  op("f32.eq"),
  op("f64.eq"),

  op("i32.ne"),
  op("i64.ne"),
  op("f32.ne"),
  op("f64.ne"),

  op("i32.lt_s"),
  op("i64.lt_s"),

  op("i32.lt_u"),
  op("i64.lt_u"),

  op("f32.lt"),
  op("f64.lt"),

  op("i32.le_s"),
  op("i64.le_s"),

  op("i32.le_u"),
  op("i64.le_u"),

  op("f32.le"),
  op("f64.le"),

  op("i32.gt_s"),
  op("i64.gt_s"),

  op("i32.gt_u"),
  op("i64.gt_u"),

  op("f32.gt"),
  op("f64.gt"),

  op("i32.ge_s"),
  op("i64.ge_s"),

  op("i32.ge_u"),
  op("i64.ge_u"),

  op("f32.ge"),
  op("f64.ge"),

  op("i32.clz"),
  op("i64.clz"),

  op("i32.ctz"),
  op("i64.ctz"),

  op("i32.popcnt"),
  op("i64.popcnt"),

  op("i32.eqz"),
  op("i64.eqz"),

  op("f32.abs"),
  op("f64.abs"),

  op("f32.neg"),
  op("f64.neg"),

  op("f32.copysign"),
  op("f64.copysign"),

  op("f32.ceil"),
  op("f64.ceil"),

  op("f32.floor"),
  op("f64.floor"),

  op("f32.trunc"),
  op("f64.trunc"),

  op("f32.nearest"),
  op("f64.nearest"),

  op("f32.sqrt"),
  op("f64.sqrt"),

  op("f32.min"),
  op("f64.min"),

  op("f32.max"),
  op("f64.max"),

  op("i32.wrap/i64"),

  op("i32.trunc_s/f32"),
  op("i32.trunc_s/f64"),
  op("i32.trunc_u/f32"),
  op("i32.trunc_u/f64"),

  op("i64.extend_s/i32"),
  op("i64.extend_u/i32"),

  op("i64.trunc_s/f32"),
  op("i64.trunc_s/f64"),
  op("i64.trunc_u/f32"),
  op("i64.trunc_u/f64"),

  op("i32.reinterpret/f32"),
  op("i64.reinterpret/f64"),
  op("f32.reinterpret/i32"),
  op("f64.reinterpret/i64"),

  op("f32.demote/f64"),

  op("f32.convert_s/i32"),
  op("f32.convert_s/i64"),
  op("f32.convert_u/i32"),
  op("f32.convert_u/i64"),

  op("f64.promote/f32"),

  op("f64.convert_s/i32"),
  op("f64.convert_s/i64"),
  op("f64.convert_u/i32"),
  op("f64.convert_u/i64"),

  op("i32.load"),
  op("i64.load"),
  op("f32.load"),
  op("f64.load"),

  op("i32.load8_s"),
  op("i32.load8_u"),
  op("i32.load16_s"),
  op("i32.load16_u"),
  op("i64.load8_s"),
  op("i64.load8_u"),
  op("i64.load16_s"),
  op("i64.load16_u"),
  op("f32.load8_s"),
  op("f32.load8_u"),
  op("f32.load16_s"),
  op("f32.load16_u"),
  op("f64.load8_s"),
  op("f64.load8_u"),
  op("f64.load16_s"),
  op("f64.load16_u"),
  op("i32.store"),
  op("i64.store"),
  op("f32.store"),
  op("f64.store"),
  op("i32.store8"),
  op("i32.store16"),
  op("i64.store8"),
  op("i64.store16"),
  op("i64.store32")
)

const foldedInstructions = map(
  array(
    seq(
      plainInstructions,
      opt(map(many(lazy(() => operations)), r => flatten(r)))
    )
  ),
  r => [...(r[1] ? r[1] : []), r[0]]
)

export const operations: Parser<
  Element[],
  ASTFunctionInstruction<AnyParameter>[]
> = or(
  lazy(() => blockInstructions),
  map(plainInstructions, r => [r]),
  foldedInstructions
)
