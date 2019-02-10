import * as Op from "@ryohey/wasm-ast"
import { map, seq, or, many, lazy, opt, Parser } from "@ryohey/fn-parser"
import { byte, var1, vector } from "./utils"
import { valType, Bytes } from "./types"
import { i64, i32, f32, f64, u32 } from "./number"

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

const op = <T extends Op.Base<string>>(
  opcode: number,
  opType: string
): Parser<Bytes, T> => map(byte(opcode), _ => ({ opType } as T))

const opV = <T extends Op.Base<string>>(
  opcode: number,
  opType: string,
  value: Parser<Bytes, Omit<T, "opType">>
): Parser<Bytes, T> =>
  map(seq(byte(opcode), value), r => ({ opType, ...r[1] } as T))

const op1 = <T extends Op.Param1<string, any>>(
  opcode: number,
  opType: string,
  value: Parser<Bytes, T["parameter"]> = var1
): Parser<Bytes, T> =>
  map(seq(byte(opcode), value), r => ({ opType, parameter: r[1] } as T))

// https://webassembly.github.io/spec/core/binary/instructions.html#binary-expr
export const instr: Parser<Bytes, Op.Any> = lazy(() =>
  or<Bytes, Op.Any>(
    op<Op.Unreachable>(0x00, "unreachable"),
    op<Op.Nop>(0x01, "nop"),
    map(
      seq(byte(0x02), blockType, expr),
      r =>
        ({
          opType: "block",
          results: r[1],
          body: r[2]
        } as Op.Block)
    ),
    map(
      seq(byte(0x03), blockType, expr),
      r =>
        ({
          opType: "loop",
          results: r[1],
          body: r[2]
        } as Op.Loop)
    ),
    map(
      seq(byte(0x04), blockType, opt(then_), expr),
      r =>
        ({
          opType: "if",
          results: r[1],
          then: r[2],
          else: r[2]
        } as Op.If)
    ),
    op1<Op.Br>(0x0c, "br"),
    op1<Op.BrIf>(0x0d, "br_if"),
    map(
      seq(byte(0x0e), vector(var1), var1),
      r =>
        ({
          opType: "br_table",
          label: r[1],
          labelIndex: r[2]
        } as Op.BrTable)
    ),
    op<Op.Return>(0x0f, "return"),
    op1<Op.Call>(0x10, "call"),
    map(
      seq(byte(0x11), var1, byte(0x00)),
      r =>
        ({
          opType: "call_indirect",
          typeIndex: r[1]
        } as Op.CallIndirect)
    ),

    op<Op.Drop>(0x1a, "drop"),
    op<Op.Select>(0x1b, "select"),

    op1<Op.Local_get>(0x20, "local.get"),
    op1<Op.Local_set>(0x21, "local.set"),
    op1<Op.Local_tee>(0x22, "local.tee"),
    op1<Op.Global_get>(0x23, "global.get"),
    op1<Op.Global_set>(0x24, "global.set"),

    opV<Op.I32_load>(0x28, "i32.load", memarg),
    opV<Op.I64_load>(0x29, "i64.load", memarg),
    opV<Op.F32_load>(0x2a, "f32.load", memarg),
    opV<Op.F64_load>(0x2b, "f64.load", memarg),
    opV<Op.I32_load8_s>(0x2c, "i32.load8_s", memarg),
    opV<Op.I32_load8_u>(0x2d, "i32.load8_u", memarg),
    opV<Op.I32_load16_s>(0x2e, "i32.load16_s", memarg),
    opV<Op.I32_load16_u>(0x2f, "i32.load16_u", memarg),
    opV<Op.I64_load8_s>(0x30, "i64.load8_s", memarg),
    opV<Op.I64_load8_u>(0x31, "i64.load8_u", memarg),
    opV<Op.I64_load16_s>(0x32, "i64.load16_s", memarg),
    opV<Op.I64_load16_u>(0x33, "i64.load16_u", memarg),
    opV<Op.I64_load32_s>(0x34, "i64.load32_s", memarg),
    opV<Op.I64_load32_u>(0x35, "i64.load32_u", memarg),
    opV<Op.I32_store>(0x36, "i32.store", memarg),
    opV<Op.I64_store>(0x37, "i64.store", memarg),
    opV<Op.F32_store>(0x38, "f32.store", memarg),
    opV<Op.F64_store>(0x39, "f64.store", memarg),
    opV<Op.I32_store8>(0x3a, "i32.store8", memarg),
    opV<Op.I32_store16>(0x3b, "i32.store16", memarg),
    opV<Op.I64_store8>(0x3c, "i64.store8", memarg),
    opV<Op.I64_store16>(0x3d, "i64.store16", memarg),
    opV<Op.I64_store32>(0x3e, "i64.store32", memarg),

    map(
      seq(byte(0x3f), byte(0x00)),
      _ => ({ opType: "memory.size" } as Op.Memory_size)
    ),
    map(
      seq(byte(0x40), byte(0x00)),
      _ => ({ opType: "memory.grow" } as Op.Memory_grow)
    ),

    op1<Op.I32_const>(0x41, "i32.const", i32),
    op1<Op.I64_const>(0x42, "i64.const", i64),
    op1<Op.F32_const>(0x43, "f32.const", f32),
    op1<Op.F64_const>(0x44, "f64.const", f64),

    op<Op.I32_eqz>(0x45, "i32.eqz"),
    op<Op.I32_eq>(0x46, "i32.eq"),
    op<Op.I32_ne>(0x47, "i32.ne"),
    op<Op.I32_lt_s>(0x48, "i32.lt_s"),
    op<Op.I32_lt_u>(0x49, "i32.lt_u"),
    op<Op.I32_gt_s>(0x4a, "i32.gt_s"),
    op<Op.I32_gt_u>(0x4b, "i32.gt_u"),
    op<Op.I32_le_s>(0x4c, "i32.le_s"),
    op<Op.I32_le_u>(0x4d, "i32.le_u"),
    op<Op.I32_ge_s>(0x4e, "i32.ge_s"),
    op<Op.I32_ge_u>(0x4f, "i32.ge_u"),

    op<Op.I64_eqz>(0x50, "i64.eqz"),
    op<Op.I64_eq>(0x51, "i64.eq"),
    op<Op.I64_ne>(0x52, "i64.ne"),
    op<Op.I64_lt_s>(0x53, "i64.lt_s"),
    op<Op.I64_lt_u>(0x54, "i64.lt_u"),
    op<Op.I64_gt_s>(0x55, "i64.gt_s"),
    op<Op.I64_gt_u>(0x56, "i64.gt_u"),
    op<Op.I64_le_s>(0x57, "i64.le_s"),
    op<Op.I64_le_u>(0x58, "i64.le_u"),
    op<Op.I64_ge_s>(0x59, "i64.ge_s"),
    op<Op.I64_ge_u>(0x5a, "i64.ge_u"),

    op<Op.F32_eq>(0x5b, "f32.eq"),
    op<Op.F32_ne>(0x5c, "f32.ne"),
    op<Op.F32_lt>(0x5d, "f32.lt"),
    op<Op.F32_gt>(0x5e, "f32.gt"),
    op<Op.F32_le>(0x5f, "f32.le"),
    op<Op.F32_ge>(0x60, "f32.ge"),

    op<Op.F64_eq>(0x61, "f64.eq"),
    op<Op.F64_ne>(0x62, "f64.ne"),
    op<Op.F64_lt>(0x63, "f64.lt"),
    op<Op.F64_gt>(0x64, "f64.gt"),
    op<Op.F64_le>(0x65, "f64.le"),
    op<Op.F64_ge>(0x66, "f64.ge"),

    op<Op.I32_clz>(0x67, "i32.clz"),
    op<Op.I32_ctz>(0x68, "i32.ctz"),
    op<Op.I32_popcnt>(0x69, "i32.popcnt"),
    op<Op.I32_add>(0x6a, "i32.add"),
    op<Op.I32_sub>(0x6b, "i32.sub"),
    op<Op.I32_mul>(0x6c, "i32.mul"),
    op<Op.I32_div_s>(0x6d, "i32.div_s"),
    op<Op.I32_div_u>(0x6e, "i32.div_u"),
    op<Op.I32_rem_s>(0x6f, "i32.rem_s"),
    op<Op.I32_rem_u>(0x70, "i32.rem_u"),
    op<Op.I32_and>(0x71, "i32.and"),
    op<Op.I32_or>(0x72, "i32.or"),
    op<Op.I32_xor>(0x73, "i32.xor"),
    op<Op.I32_shl>(0x74, "i32.shl"),
    op<Op.I32_shr_s>(0x75, "i32.shr_s"),
    op<Op.I32_shr_u>(0x76, "i32.shr_u"),
    op<Op.I32_rotl>(0x77, "i32.rotl"),
    op<Op.I32_rotr>(0x78, "i32.rotr"),

    op<Op.I64_clz>(0x79, "i64.clz"),
    op<Op.I64_ctz>(0x7a, "i64.ctz"),
    op<Op.I64_popcnt>(0x7b, "i64.popcnt"),
    op<Op.I64_add>(0x7c, "i64.add"),
    op<Op.I64_sub>(0x7d, "i64.sub"),
    op<Op.I64_mul>(0x7e, "i64.mul"),
    op<Op.I64_div_s>(0x7f, "i64.div_s"),
    op<Op.I64_div_u>(0x80, "i64.div_u"),
    op<Op.I64_rem_s>(0x81, "i64.rem_s"),
    op<Op.I64_rem_u>(0x82, "i64.rem_u"),
    op<Op.I64_and>(0x83, "i64.and"),
    op<Op.I64_or>(0x84, "i64.or"),
    op<Op.I64_xor>(0x85, "i64.xor"),
    op<Op.I64_shl>(0x86, "i64.shl"),
    op<Op.I64_shr_s>(0x87, "i64.shr_s"),
    op<Op.I64_shr_u>(0x88, "i64.shr_u"),
    op<Op.I64_rotl>(0x89, "i64.rot_l"),
    op<Op.I64_rotr>(0x8a, "i64.rotr"),

    op<Op.F32_abs>(0x8b, "f32.abs"),
    op<Op.F32_neg>(0x8c, "f32.neg"),
    op<Op.F32_ceil>(0x8d, "f32.ceil"),
    op<Op.F32_floor>(0x8e, "f32.floor"),
    op<Op.F32_trunc>(0x8f, "f32.trunc"),
    op<Op.F32_nearest>(0x90, "f32.nearest"),
    op<Op.F32_sqrt>(0x91, "f32.sqrt"),
    op<Op.F32_add>(0x92, "f32.add"),
    op<Op.F32_sub>(0x93, "f32.sub"),
    op<Op.F32_mul>(0x94, "f32.mul"),
    op<Op.F32_div>(0x95, "f32.div"),
    op<Op.F32_min>(0x96, "f32.min"),
    op<Op.F32_max>(0x97, "f32.max"),
    op<Op.F32_copysign>(0x98, "f32.copysign"),

    op<Op.F64_abs>(0x99, "f64.abs"),
    op<Op.F64_neg>(0x9a, "f64.neg"),
    op<Op.F64_ceil>(0x9b, "f64.ceil"),
    op<Op.F64_floor>(0x9c, "f64.floor"),
    op<Op.F64_trunc>(0x9d, "f64.trunc"),
    op<Op.F64_nearest>(0x9e, "f64.nearest"),
    op<Op.F64_sqrt>(0x9f, "f64.sqrt"),
    op<Op.F64_add>(0xa0, "f64.add"),
    op<Op.F64_sub>(0xa1, "f64.sub"),
    op<Op.F64_mul>(0xa2, "f64.mul"),
    op<Op.F64_div>(0xa3, "f64.div"),
    op<Op.F64_min>(0xa4, "f64.fmin"),
    op<Op.F64_max>(0xa5, "f64.fmax"),
    op<Op.F64_copysign>(0xa6, "f64.copysign"),

    op<Op.I32_wrap_i64>(0xa7, "i32.wrap_i64"),
    op<Op.I32_trunc_f32_s>(0xa8, "i32.trunc_f32_s"),
    op<Op.I32_trunc_f32_u>(0xa9, "i32.trunc_f32_u"),
    op<Op.I32_trunc_f64_s>(0xaa, "i32.trunc_f64_s"),
    op<Op.I32_trunc_f64_u>(0xab, "i32.trunc_f64_u"),
    op<Op.I64_extend_i32_s>(0xac, "i64.extend_i32_s"),
    op<Op.I64_extend_i32_u>(0xad, "i64.extend_i32_u"),
    op<Op.I64_trunc_f32_s>(0xae, "i64.trunc_f32_s"),
    op<Op.I64_trunc_f32_u>(0xaf, "i64.trunc_f32_u"),
    op<Op.I64_trunc_f64_s>(0xb0, "i64.trunc_f64_s"),
    op<Op.I64_trunc_f64_u>(0xb1, "i64.trunc_f64_u"),
    op<Op.F32_convert_i32_s>(0xb2, "f32.convert_i32_s"),
    op<Op.F32_convert_i32_u>(0xb3, "f32.convert_i32_u"),
    op<Op.F32_convert_i64_s>(0xb4, "f32.convert_i64_s"),
    op<Op.F32_convert_i64_u>(0xb5, "f32.convert_i64_u"),
    op<Op.F32_demote_f64>(0xb6, "f32.demote_f64"),
    op<Op.F64_convert_i32_s>(0xb7, "f64.convert_i32_s"),
    op<Op.F64_convert_i32_u>(0xb8, "f64.convert_i32_u"),
    op<Op.F64_convert_i64_s>(0xb9, "f64.convert_i64_s"),
    op<Op.F64_convert_i64_u>(0xba, "f64.convert_i64_u"),
    op<Op.F64_promote_f32>(0xbb, "f64.promote_f32"),
    op<Op.I32_reinterpret_f32>(0xbc, "i32.reinterpret_f32"),
    op<Op.I64_reinterpret_f64>(0xbd, "i64.reinterpret_f64"),
    op<Op.F32_reinterpret_i32>(0xbe, "f32.reinterpret_i32"),
    op<Op.F64_reinterpret_i64>(0xbf, "f64.reinterpret_i64")
  )
)

const memarg = map(seq(u32, u32), r => ({ align: r[0], offset: r[1] }))

const blockType = or(
  // void
  map(byte(0x40), _ => []),
  map(valType, t => [t])
)

const then_ = map(seq(many(instr), byte(0x05)), r => r[0])
export const expr = map(seq(many(instr), byte(0x0b)), r => r[0])
