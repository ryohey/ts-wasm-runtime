import { Int64Value } from "../wat-parser/types"
import { countTrailingZeros, countLeadingZeros, popCount } from "../misc/number"

const unsigned = (a: bigint): bigint => BigInt.asUintN(64, a)
const signed = (a: bigint): bigint => BigInt.asIntN(64, a)

export class Int64 {
  readonly value: bigint

  constructor(value: bigint) {
    this.value = signed(value)
  }

  toString = (radix: number) => this.value.toString(radix)
  toNumber = () => Number(this.value)
  toObject = (): Int64Value => ({ i64: this.toString(10) })

  static obj = (value: Int64Value): Int64 => new Int64(BigInt(value.i64))
  static hex = (value: string): Int64 => new Int64(BigInt(value))
  static bool = (value: boolean): Int64 => (value ? Int64.one : Int64.zero)

  static one: Int64 = new Int64(BigInt(1))
  static zero: Int64 = new Int64(BigInt(0))

  static not = (a: Int64): Int64 => new Int64(~a.value)
  static neg = (a: Int64): Int64 => new Int64(-a.value)
  static and = (a: Int64, b: Int64): Int64 => new Int64(a.value & b.value)
  static or = (a: Int64, b: Int64): Int64 => new Int64(a.value | b.value)
  static xor = (a: Int64, b: Int64): Int64 => new Int64(a.value ^ b.value)
  static shiftLeft = (a: Int64, b: Int64 = Int64.one): Int64 =>
    new Int64(a.value << b.value)
  static shiftRight_s = (a: Int64, b: Int64 = Int64.one): Int64 =>
    new Int64(a.value >> b.value)
  static shiftRight_u = (a: Int64, b: Int64 = Int64.one): Int64 =>
    new Int64(unsigned(a.value) >> unsigned(b.value))

  static isZero = (a: Int64): boolean => a.value === Int64.zero.value
  static isNegative = (a: Int64): boolean => a.value < Int64.zero.value
  static isOdd = (a: Int64): boolean =>
    (a.value & Int64.one.value) === Int64.one.value
  static equal = (a: Int64, b: Int64): boolean =>
    (a.value & b.value) === a.value
  static notEqual = (a: Int64, b: Int64): boolean => !Int64.equal(a, b)

  static add = (a: Int64, b: Int64): Int64 => new Int64(a.value + b.value)
  static sub = (a: Int64, b: Int64): Int64 => new Int64(a.value - b.value)
  static mul = (a: Int64, b: Int64): Int64 => new Int64(a.value * b.value)

  static div_s = (a: Int64, b: Int64): Int64 => new Int64(a.value / b.value)
  static div_u = (a: Int64, b: Int64): Int64 =>
    new Int64(unsigned(a.value) / unsigned(b.value))

  static rem_s = (a: Int64, b: Int64): Int64 => new Int64(a.value % b.value)
  static rem_u = (a: Int64, b: Int64): Int64 =>
    new Int64(unsigned(a.value) % unsigned(b.value))

  static greaterThan_s = (a: Int64, b: Int64): boolean => a.value > b.value
  static greaterThan_u = (a: Int64, b: Int64): boolean =>
    unsigned(a.value) > unsigned(b.value)

  static greaterThanOrEqual_s = (a: Int64, b: Int64): boolean =>
    a.value >= b.value
  static greaterThanOrEqual_u = (a: Int64, b: Int64): boolean =>
    unsigned(a.value) >= unsigned(b.value)

  static lessThan_s = (a: Int64, b: Int64): boolean => a.value < b.value
  static lessThan_u = (a: Int64, b: Int64): boolean =>
    unsigned(a.value) < unsigned(b.value)

  static lessThanOrEqual_s = (a: Int64, b: Int64): boolean => a.value <= b.value
  static lessThanOrEqual_u = (a: Int64, b: Int64): boolean =>
    unsigned(a.value) <= unsigned(b.value)

  static ctz = (a: Int64): Int64 =>
    new Int64(BigInt(countTrailingZeros(a.value.toString(2), 64)))
  static clz = (a: Int64): Int64 =>
    new Int64(BigInt(countLeadingZeros(a.value.toString(2), 64)))
  static popcnt = (a: Int64): Int64 =>
    new Int64(BigInt(popCount(a.value.toString(2))))
}
