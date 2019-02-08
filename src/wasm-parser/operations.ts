import { lazy, many, map, opt, or, seq } from "../parser/parser"
import { f32, f64, i32, i64 } from "./number"
import { valType } from "./types"
import { byte, var1, vector } from "./utils"

// https://webassembly.github.io/spec/core/binary/instructions.html#binary-expr
export const instr = lazy(() =>
  or(
    map(byte(0x00), _ => ({ opType: "unreachable" })),
    map(byte(0x01), _ => ({ opType: "nop" })),
    map(seq(byte(0x02), blockType, expr), r => ({
      opType: "block",
      results: r[1],
      body: r[2]
    })),
    map(seq(byte(0x03), blockType, expr), r => ({
      opType: "loop",
      results: r[1],
      body: r[2]
    })),
    map(seq(byte(0x04), blockType, opt(then_), expr), r => ({
      opType: "if",
      results: r[1],
      then: r[2],
      else: r[2]
    })),
    map(seq(byte(0x0c), var1), r => ({ opType: "br", label: r[1] })),
    map(seq(byte(0x0d), var1), r => ({ opType: "br_if", label: r[1] })),
    map(seq(byte(0x0e), vector(var1), var1), r => ({
      opType: "br_table",
      label: r[1],
      labelIndex: r[2]
    })),
    map(byte(0x0f), _ => ({ opType: "return" })),
    map(seq(byte(0x10), var1), r => ({ opType: "call", funcIndex: r[1] })),
    map(seq(byte(0x11), var1, byte(0x00)), r => ({
      opType: "call_indirect",
      typeIndex: r[1]
    })),

    map(byte(0x1a), _ => ({ opType: "drop" })),
    map(byte(0x1b), _ => ({ opType: "select" })),

    map(seq(byte(0x20), var1), r => ({ opType: "local.get", parameter: r[1] })),
    map(seq(byte(0x21), var1), r => ({ opType: "local.set", parameter: r[1] })),
    map(seq(byte(0x22), var1), r => ({ opType: "local.tee", parameter: r[1] })),
    map(seq(byte(0x23), var1), r => ({
      opType: "global.get",
      parameter: r[1]
    })),
    map(seq(byte(0x24), var1), r => ({
      opType: "global.set",
      parameter: r[1]
    })),

    map(seq(byte(0x28), memarg), r => ({
      opType: "i32.load",
      parameter: r[1]
    })),
    map(seq(byte(0x29), memarg), r => ({
      opType: "i64.load",
      parameter: r[1]
    })),
    map(seq(byte(0x2a), memarg), r => ({
      opType: "f32.load",
      parameter: r[1]
    })),
    map(seq(byte(0x2b), memarg), r => ({
      opType: "f64.load",
      parameter: r[1]
    })),
    map(seq(byte(0x2c), memarg), r => ({
      opType: "i32.load8_s",
      parameter: r[1]
    })),
    map(seq(byte(0x2d), memarg), r => ({
      opType: "i32.load8_u",
      parameter: r[1]
    })),
    map(seq(byte(0x2e), memarg), r => ({
      opType: "i32.load16_s",
      parameter: r[1]
    })),
    map(seq(byte(0x2f), memarg), r => ({
      opType: "i32.load16_u",
      parameter: r[1]
    })),
    map(seq(byte(0x30), memarg), r => ({
      opType: "i64.load8_s",
      parameter: r[1]
    })),
    map(seq(byte(0x31), memarg), r => ({
      opType: "i64.load8_u",
      parameter: r[1]
    })),
    map(seq(byte(0x32), memarg), r => ({
      opType: "i64.load16_s",
      parameter: r[1]
    })),
    map(seq(byte(0x33), memarg), r => ({
      opType: "i64.load16_u",
      parameter: r[1]
    })),
    map(seq(byte(0x34), memarg), r => ({
      opType: "i64.load32_s",
      parameter: r[1]
    })),
    map(seq(byte(0x35), memarg), r => ({
      opType: "i64.load32_u",
      parameter: r[1]
    })),
    map(seq(byte(0x36), memarg), r => ({
      opType: "i32.store",
      parameter: r[1]
    })),
    map(seq(byte(0x37), memarg), r => ({
      opType: "i64.store",
      parameter: r[1]
    })),
    map(seq(byte(0x38), memarg), r => ({
      opType: "f32.store",
      parameter: r[1]
    })),
    map(seq(byte(0x39), memarg), r => ({
      opType: "f64.store",
      parameter: r[1]
    })),
    map(seq(byte(0x3a), memarg), r => ({
      opType: "i32.store8",
      parameter: r[1]
    })),
    map(seq(byte(0x3b), memarg), r => ({
      opType: "i32.store16",
      parameter: r[1]
    })),
    map(seq(byte(0x3c), memarg), r => ({
      opType: "i64.store8",
      parameter: r[1]
    })),
    map(seq(byte(0x3d), memarg), r => ({
      opType: "i64.store16",
      parameter: r[1]
    })),
    map(seq(byte(0x3e), memarg), r => ({
      opType: "i64.store32",
      parameter: r[1]
    })),
    map(seq(byte(0x3f), byte(0x00)), r => ({ opType: "memory.size" })),
    map(seq(byte(0x40), byte(0x00)), r => ({ opType: "memory.grow" })),

    map(seq(byte(0x41), i32), r => ({
      opType: "i32.const",
      parameter: r[1]
    })),
    map(seq(byte(0x42), i64), r => ({
      opType: "i64.const",
      parameter: r[1]
    })),
    map(seq(byte(0x43), f32), r => ({
      opType: "f32.const",
      parameter: r[1]
    })),
    map(seq(byte(0x44), f64), r => ({
      opType: "f64.const",
      parameter: r[1]
    })),

    map(byte(0x45), _ => ({ opType: "i32.eqz" })),
    map(byte(0x46), _ => ({ opType: "i32.eq" })),
    map(byte(0x47), _ => ({ opType: "i32.ne" })),
    map(byte(0x48), _ => ({ opType: "i32.lt_s" })),
    map(byte(0x49), _ => ({ opType: "i32.lt_u" })),
    map(byte(0x4a), _ => ({ opType: "i32.gt_s" })),
    map(byte(0x4b), _ => ({ opType: "i32.gt_u" })),
    map(byte(0x4c), _ => ({ opType: "i32.le_s" })),
    map(byte(0x4d), _ => ({ opType: "i32.le_u" })),
    map(byte(0x4e), _ => ({ opType: "i32.ge_s" })),
    map(byte(0x4f), _ => ({ opType: "i32.ge_u" })),

    map(byte(0x50), _ => ({ opType: "i64.eqz" })),
    map(byte(0x51), _ => ({ opType: "i64.eq" })),
    map(byte(0x52), _ => ({ opType: "i64.ne" })),
    map(byte(0x53), _ => ({ opType: "i64.lt_s" })),
    map(byte(0x54), _ => ({ opType: "i64.lt_u" })),
    map(byte(0x55), _ => ({ opType: "i64.gt_s" })),
    map(byte(0x56), _ => ({ opType: "i64.gt_u" })),
    map(byte(0x57), _ => ({ opType: "i64.le_s" })),
    map(byte(0x58), _ => ({ opType: "i64.le_u" })),
    map(byte(0x59), _ => ({ opType: "i64.ge_s" })),
    map(byte(0x5a), _ => ({ opType: "i64.ge_u" })),

    map(byte(0x5b), _ => ({ opType: "f32.eq" })),
    map(byte(0x5c), _ => ({ opType: "f32.ne" })),
    map(byte(0x5d), _ => ({ opType: "f32.lt" })),
    map(byte(0x5e), _ => ({ opType: "f32.gt" })),
    map(byte(0x5f), _ => ({ opType: "f32.le" })),
    map(byte(0x60), _ => ({ opType: "f32.ge" })),

    map(byte(0x61), _ => ({ opType: "f64.eq" })),
    map(byte(0x62), _ => ({ opType: "f64.ne" })),
    map(byte(0x63), _ => ({ opType: "f64.lt" })),
    map(byte(0x64), _ => ({ opType: "f64.gt" })),
    map(byte(0x65), _ => ({ opType: "f64.le" })),
    map(byte(0x66), _ => ({ opType: "f64.ge" })),

    map(byte(0x67), _ => ({ opType: "i32.clz" })),
    map(byte(0x68), _ => ({ opType: "i32.ctz" })),
    map(byte(0x69), _ => ({ opType: "i32.popcnt" })),
    map(byte(0x6a), _ => ({ opType: "i32.add" })),
    map(byte(0x6b), _ => ({ opType: "i32.sub" })),
    map(byte(0x6c), _ => ({ opType: "i32.mul" })),
    map(byte(0x6d), _ => ({ opType: "i32.div_s" })),
    map(byte(0x6e), _ => ({ opType: "i32.div_u" })),
    map(byte(0x6f), _ => ({ opType: "i32.rem_s" })),
    map(byte(0x70), _ => ({ opType: "i32.rem_u" })),
    map(byte(0x71), _ => ({ opType: "i32.and" })),
    map(byte(0x72), _ => ({ opType: "i32.or" })),
    map(byte(0x73), _ => ({ opType: "i32.xor" })),
    map(byte(0x74), _ => ({ opType: "i32.shl" })),
    map(byte(0x75), _ => ({ opType: "i32.shr_s" })),
    map(byte(0x76), _ => ({ opType: "i32.shr_u" })),
    map(byte(0x77), _ => ({ opType: "i32.rotl" })),
    map(byte(0x78), _ => ({ opType: "i32.rotr" })),

    map(byte(0x79), _ => ({ opType: "i64.clz" })),
    map(byte(0x7a), _ => ({ opType: "i64.ctz" })),
    map(byte(0x7b), _ => ({ opType: "i64.popcnt" })),
    map(byte(0x7c), _ => ({ opType: "i64.add" })),
    map(byte(0x7d), _ => ({ opType: "i64.sub" })),
    map(byte(0x7e), _ => ({ opType: "i64.mul" })),
    map(byte(0x7f), _ => ({ opType: "i64.div_s" })),
    map(byte(0x80), _ => ({ opType: "i64.div_u" })),
    map(byte(0x81), _ => ({ opType: "i64.rem_s" })),
    map(byte(0x82), _ => ({ opType: "i64.rem_u" })),
    map(byte(0x83), _ => ({ opType: "i64.and" })),
    map(byte(0x84), _ => ({ opType: "i64.or" })),
    map(byte(0x85), _ => ({ opType: "i64.xor" })),
    map(byte(0x86), _ => ({ opType: "i64.shl" })),
    map(byte(0x87), _ => ({ opType: "i64.shr_s" })),
    map(byte(0x88), _ => ({ opType: "i64.shr_u" })),
    map(byte(0x89), _ => ({ opType: "i64.rotl" })),
    map(byte(0x8a), _ => ({ opType: "i64.rotr" })),

    map(byte(0x8b), _ => ({ opType: "f32.abs" })),
    map(byte(0x8c), _ => ({ opType: "f32.neg" })),
    map(byte(0x8d), _ => ({ opType: "f32.ceil" })),
    map(byte(0x8e), _ => ({ opType: "f32.floor" })),
    map(byte(0x8f), _ => ({ opType: "f32.trunc" })),
    map(byte(0x90), _ => ({ opType: "f32.nearest" })),
    map(byte(0x91), _ => ({ opType: "f32.sqrt" })),
    map(byte(0x92), _ => ({ opType: "f32.add" })),
    map(byte(0x93), _ => ({ opType: "f32.sub" })),
    map(byte(0x94), _ => ({ opType: "f32.mul" })),
    map(byte(0x95), _ => ({ opType: "f32.div" })),
    map(byte(0x96), _ => ({ opType: "f32.fmin" })),
    map(byte(0x97), _ => ({ opType: "f32.fmax" })),
    map(byte(0x98), _ => ({ opType: "f32.copysign" })),

    map(byte(0x99), _ => ({ opType: "f64.abs" })),
    map(byte(0x9a), _ => ({ opType: "f64.neg" })),
    map(byte(0x9b), _ => ({ opType: "f64.ceil" })),
    map(byte(0x9c), _ => ({ opType: "f64.floor" })),
    map(byte(0x9d), _ => ({ opType: "f64.trunc" })),
    map(byte(0x9e), _ => ({ opType: "f64.nearest" })),
    map(byte(0x9f), _ => ({ opType: "f64.sqrt" })),
    map(byte(0xa0), _ => ({ opType: "f64.add" })),
    map(byte(0xa1), _ => ({ opType: "f64.sub" })),
    map(byte(0xa2), _ => ({ opType: "f64.mul" })),
    map(byte(0xa3), _ => ({ opType: "f64.div" })),
    map(byte(0xa4), _ => ({ opType: "f64.fmin" })),
    map(byte(0xa5), _ => ({ opType: "f64.fmax" })),
    map(byte(0xa6), _ => ({ opType: "f64.copysign" })),

    map(byte(0xa7), _ => ({ opType: "i32.wrap_i64" })),
    map(byte(0xa8), _ => ({ opType: "i32.trunc_f32_s" })),
    map(byte(0xa9), _ => ({ opType: "i32.trunc_f32_u" })),
    map(byte(0xaa), _ => ({ opType: "i32.trunc_f64_s" })),
    map(byte(0xab), _ => ({ opType: "i32.trunc_f64_u" })),
    map(byte(0xac), _ => ({ opType: "i64.extend_i32_s" })),
    map(byte(0xad), _ => ({ opType: "i64.extend_i32_u" })),
    map(byte(0xae), _ => ({ opType: "i64.trunc_f32_s" })),
    map(byte(0xaf), _ => ({ opType: "i64.trunc_f32_u" })),
    map(byte(0xb0), _ => ({ opType: "i64.trunc_f64_s" })),
    map(byte(0xb1), _ => ({ opType: "i64.trunc_f64_u" })),
    map(byte(0xb2), _ => ({ opType: "f32.convert_i32_s" })),
    map(byte(0xb3), _ => ({ opType: "f32.convert_i32_u" })),
    map(byte(0xb4), _ => ({ opType: "f32.convert_i64_s" })),
    map(byte(0xb5), _ => ({ opType: "f32.convert_i64_u" })),
    map(byte(0xb6), _ => ({ opType: "f32.demote_f64" })),
    map(byte(0xb7), _ => ({ opType: "f64.convert_i32_s" })),
    map(byte(0xb8), _ => ({ opType: "f64.convert_i32_u" })),
    map(byte(0xb9), _ => ({ opType: "f64.convert_i64_s" })),
    map(byte(0xba), _ => ({ opType: "f64.convert_i64_u" })),
    map(byte(0xbb), _ => ({ opType: "f64.promote_f32" })),
    map(byte(0xbc), _ => ({ opType: "i32.reinterpret_f32" })),
    map(byte(0xbd), _ => ({ opType: "i64.reinterpret_f64" })),
    map(byte(0xbe), _ => ({ opType: "f32.reinterpret_i32" })),
    map(byte(0xbf), _ => ({ opType: "f64.reinterpret_i64" }))
  )
)

const memarg = map(seq(var1, var1), r => ({ align: r[0], offset: r[1] }))

const blockType = or(
  // void
  map(byte(0x40), _ => []),
  map(valType, t => [t])
)

const then_ = map(seq(many(instr), byte(0x05)), r => r[0])
export const expr = map(seq(many(instr), byte(0x0b)), r => r[0])
