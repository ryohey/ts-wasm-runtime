import { Float64Value } from "@ryohey/wasm-ast"

// fake f64
export class Float64 {
  readonly value: number

  constructor(value: number) {
    this.value = value
  }

  toString = (radix: number) => this.value.toString(radix)
  toNumber = () => this.value
  toObject = (): Float64Value => ({ f64: this.toBytes() })
  toBytes = (): Uint8Array => {
    throw new Error("not implemented")
  }

  static obj = (value: Float64Value): Float64 => Float64.bytes(value.f64)
  static bytes = (v: Uint8Array): Float64 => {
    throw new Error("not implemented")
  }

  static add = (a: Float64, b: Float64) => new Float64(a.value + b.value)
  static sub = (a: Float64, b: Float64) => new Float64(a.value - b.value)
  static mul = (a: Float64, b: Float64) => new Float64(a.value * b.value)
  static div = (a: Float64, b: Float64) => new Float64(a.value / b.value)
  static rem = (a: Float64, b: Float64) => new Float64(a.value % b.value)
  static equal = (a: Float64, b: Float64) => a.value === b.value
  static notEqual = (a: Float64, b: Float64) => a.value !== b.value
  static lessThan = (a: Float64, b: Float64) => a.value < b.value
  static lessThanOrEqual = (a: Float64, b: Float64) => a.value <= b.value
  static greaterThan = (a: Float64, b: Float64) => a.value > b.value
  static greaterThanOrEqual = (a: Float64, b: Float64) => a.value >= b.value
  static min = (a: Float64, b: Float64) =>
    new Float64(Math.min(a.value, b.value))
  static max = (a: Float64, b: Float64) =>
    new Float64(Math.max(a.value, b.value))

  static abs = (a: Float64) => new Float64(Math.abs(a.value))
  static neg = (a: Float64) => new Float64(-a.value)
  static ceil = (a: Float64) => new Float64(Math.ceil(a.value))
  static floor = (a: Float64) => new Float64(Math.floor(a.value))
  static sqrt = (a: Float64) => new Float64(Math.sqrt(a.value))
  static trunc = (a: Float64) => new Float64(Math.trunc(a.value))
  static nearest = (a: Float64) => new Float64(2 * Math.round(a.value / 2))
}
