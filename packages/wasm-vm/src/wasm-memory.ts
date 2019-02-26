import { Instruction, VMMemory } from "./vm"
import { Stack } from "./stack"
import {
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value,
  Op
} from "@ryohey/wasm-ast"
import { Int32, Float32, Int64, Float64 } from "./number"
import { WASMFunction } from "./module"

export type WASMCodeParameter =
  | number
  | Int32Value
  | Int64Value
  | Float32Value
  | Float64Value

export type WASMCode = Op.Any

export type WASMMemoryValue = Int32 | Int64 | Float32 | Float64

export type WASMTable = {
  // index: funcId
  [key: number]: number
}

export interface WASMMemory extends VMMemory {
  // control instruction のみが直接 stack を触るべき
  readonly values: Stack<WASMMemoryValue>
  readonly memory: WASMMemoryValue[]
  readonly global: WASMMemoryValue[]
  readonly local: WASMMemoryValue[]
  readonly functions: WASMFunction[]
  readonly table: WASMTable
  readonly programCounter: number
  programTerminated: boolean
}

// 通常の instruction が操作できるメモリ
export type WASMLocalMemory = Pick<
  WASMMemory,
  "values" | "memory" | "global" | "local"
>

export type PartialInstructionSet<T, S> = (code: T) => Instruction<S> | null
