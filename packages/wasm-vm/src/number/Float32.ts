import { Float32Value } from "@ryohey/wasm-ast"

export class Float32 {
  readonly value: number

  constructor(value: number) {
    this.value = value
  }

  toString = (radix: number) => this.value.toString(radix)
  toNumber = () => this.value
  toObject = (): Float32Value => ({ f32: this.value })

  static obj = (value: Float32Value): Float32 => new Float32(value.f32)
  static add = (a: Float32, b: Float32) => new Float32(a.value + b.value)
  static sub = (a: Float32, b: Float32) => new Float32(a.value - b.value)
  static mul = (a: Float32, b: Float32) => new Float32(a.value * b.value)
  static div = (a: Float32, b: Float32) => new Float32(a.value / b.value)
  static rem = (a: Float32, b: Float32) => new Float32(a.value % b.value)
  static equal = (a: Float32, b: Float32) => a.value === b.value
  static notEqual = (a: Float32, b: Float32) => a.value !== b.value
  static lessThan = (a: Float32, b: Float32) => a.value < b.value
  static lessThanOrEqual = (a: Float32, b: Float32) => a.value <= b.value
  static greaterThan = (a: Float32, b: Float32) => a.value > b.value
  static greaterThanOrEqual = (a: Float32, b: Float32) => a.value >= b.value
  static min = (a: Float32, b: Float32) =>
    new Float32(Math.min(a.value, b.value))
  static max = (a: Float32, b: Float32) =>
    new Float32(Math.max(a.value, b.value))

  static abs = (a: Float32) => new Float32(Math.abs(a.value))
  static neg = (a: Float32) => new Float32(-a.value)
  static ceil = (a: Float32) => new Float32(Math.ceil(a.value))
  static floor = (a: Float32) => new Float32(Math.floor(a.value))
  static sqrt = (a: Float32) => new Float32(Math.sqrt(a.value))
  static trunc = (a: Float32) => new Float32(Math.trunc(a.value))
  static nearest = (a: Float32) => new Float32(2 * Math.round(a.value / 2))
}
