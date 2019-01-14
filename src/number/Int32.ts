import { Int32Value } from "../wat-parser/types"
import { countTrailingZeros, countLeadingZeros, popCount } from "../misc/number"

const unsigned = (a: number): number => a >>> 0
const signed = (a: number): number => a >> 0

export class Int32 {
  readonly value: number

  constructor(value: number) {
    this.value = signed(value)
  }

  toString(radix: number) {
    const negative = Int32.isNegative(this)
    const abs = negative ? Int32.neg(this) : this
    const sign = negative ? "-" : ""
    return sign + abs.value.toString(radix)
  }

  toNumber() {
    return this.value
  }

  toInt(): Int32Value {
    return { i32: this.toString(10) }
  }

  static int = (value: Int32Value): Int32 =>
    new Int32(parseInt(value.i32, value.isHex ? 16 : 10))
  static hex = (value: string): Int32 => new Int32(parseInt(value, 16))
  static bool = (value: boolean): Int32 => (value ? Int32.one : Int32.zero)

  static one: Int32 = new Int32(1)
  static zero: Int32 = new Int32(0)

  static not = (a: Int32): Int32 => new Int32(~a.value)
  static neg = (a: Int32): Int32 => new Int32(-a)
  static and = (a: Int32, b: Int32): Int32 => new Int32(a.value & b.value)
  static or = (a: Int32, b: Int32): Int32 => new Int32(a.value | b.value)
  static xor = (a: Int32, b: Int32): Int32 => new Int32(a.value ^ b.value)
  static shiftLeft = (a: Int32, b: Int32 = Int32.one): Int32 =>
    new Int32(a.value << b.value)
  static shiftRight_s = (a: Int32, b: Int32 = Int32.one): Int32 =>
    new Int32(a.value >> b.value)
  static shiftRight_u = (a: Int32, b: Int32 = Int32.one): Int32 =>
    new Int32(a.value >>> b.value)

  static isZero = (a: Int32): boolean => a.value === 0
  static isNegative = (a: Int32): boolean => a.value >> 31 === 1
  static isOdd = (a: Int32): boolean => (a.value & 1) === 1
  static equal = (a: Int32, b: Int32): boolean =>
    (a.value & b.value) === a.value
  static notEqual = (a: Int32, b: Int32): boolean => !Int32.equal(a, b)

  static add = (a: Int32, b: Int32): Int32 => {
    while (!Int32.isZero(b)) {
      const c = Int32.shiftLeft(Int32.and(a, b), Int32.one)
      a = Int32.xor(a, b)
      b = c
    }
    return a
  }

  static sub = (a: Int32, b: Int32): Int32 => Int32.add(a, Int32.neg(b))

  static mul = (x: Int32, y: Int32): Int32 => {
    let negative = false

    if (Int32.isNegative(x) && !Int32.isNegative(y)) {
      x = Int32.neg(x)
      negative = true
    } else if (Int32.isNegative(y) && !Int32.isNegative(x)) {
      y = Int32.neg(y)
      negative = true
    } else if (Int32.isNegative(y) && Int32.isNegative(x)) {
      x = Int32.neg(x)
      y = Int32.neg(y)
    }

    let res = Int32.zero
    while (!Int32.isZero(y)) {
      if (Int32.isOdd(y)) {
        res = Int32.add(res, x)
      }
      x = Int32.shiftLeft(x)
      y = Int32.shiftRight_u(y)
    }
    return negative ? Int32.neg(res) : res
  }

  static div_s = (a: Int32, b: Int32): Int32 => new Int32(a.value / b.value)
  static div_u = (a: Int32, b: Int32): Int32 =>
    new Int32(unsigned(a.value) / unsigned(b.value))

  static rem_s = (a: Int32, b: Int32): Int32 => new Int32(a.value % b.value)
  static rem_u = (a: Int32, b: Int32): Int32 =>
    new Int32(unsigned(a.value) % unsigned(b.value))

  static greaterThan_s = (a: Int32, b: Int32): boolean => a.value > b.value
  static greaterThan_u = (a: Int32, b: Int32): boolean =>
    unsigned(a.value) > unsigned(b.value)

  static greaterThanOrEqual_s = (a: Int32, b: Int32): boolean =>
    a.value >= b.value
  static greaterThanOrEqual_u = (a: Int32, b: Int32): boolean =>
    unsigned(a.value) >= unsigned(b.value)

  static lessThan_s = (a: Int32, b: Int32): boolean => a.value < b.value
  static lessThan_u = (a: Int32, b: Int32): boolean =>
    unsigned(a.value) < unsigned(b.value)

  static lessThanOrEqual_s = (a: Int32, b: Int32): boolean => a.value <= b.value
  static lessThanOrEqual_u = (a: Int32, b: Int32): boolean =>
    unsigned(a.value) <= unsigned(b.value)

  static ctz = (a: Int32): Int32 => new Int32(countTrailingZeros(a.value, 32))
  static clz = (a: Int32): Int32 => new Int32(countLeadingZeros(a.value, 32))
  static popcnt = (a: Int32): Int32 => new Int32(popCount(a.value))
}
