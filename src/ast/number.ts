export interface Int32Value {
  i32: string
  isHex?: boolean
}
export interface Int64Value {
  i64: string
  isHex?: boolean
}
export interface Float32Value {
  f32: string
}
export interface Float64Value {
  f64: string
}
export type NumberValue = Int32Value | Int64Value | Float32Value | Float64Value

export enum ValType {
  i32 = "i32",
  i64 = "i64",
  f32 = "f32",
  f64 = "f64"
}
