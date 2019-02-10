import { Instruction } from "../vm/vm"
import { Stack } from "./stack"
import {
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value
} from "../ast/number"
import { Int32 } from "../number/Int32"
import { Float32 } from "../number/Float32"
import { Int64 } from "../number/Int64"
import { Float64 } from "../number/Float64"
import * as Op from "../ast/instructions"
import { ASTFunction } from "../ast/module"

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

export interface WASMModule {
  functions: ASTFunction[]
  table: WASMTable
}

export interface WASMMemory {
  // control instruction のみが直接 stack を触るべき
  readonly values: Stack<WASMMemoryValue>
  readonly memory: WASMMemoryValue[]
  readonly global: WASMMemoryValue[]
  readonly local: WASMMemoryValue[]
  readonly functions: ASTFunction[]
  readonly table: WASMTable
  readonly programCounter: number
}

// 通常の instruction が操作できるメモリ
export type WASMLocalMemory = Pick<
  WASMMemory,
  "values" | "memory" | "global" | "local"
>

export type PartialInstructionSet<T, S> = (code: T) => Instruction<S> | null