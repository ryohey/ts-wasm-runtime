import { Instruction } from "../vm/vm"
import { Stack } from "./stack"
import {
  ValType,
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value
} from "../wat-parser/types"
import { Int32 } from "../number/Int32"
import { Float32 } from "../number/Float32"
import { ASTFunction } from "../wat-parser/func"

export type WASMCodeParameter =
  | number
  | Int32Value
  | Int64Value
  | Float32Value
  | Float64Value

export interface WASMCode {
  readonly opcode: string
  readonly parameters: WASMCodeParameter[]
}

export type WASMMemoryValue = Int32 | Float32

export class WASMContext {
  readonly values = new Stack<WASMMemoryValue>()
  readonly labelPosition: number
  readonly resultLength: number

  constructor(resultLength: number = 0, labelPosition: number = 0) {
    this.resultLength = resultLength
    this.labelPosition = labelPosition
  }
}

export type WASMFunction = {
  export: string
  identifier: string
  parameters: ValType[]
  locals: ValType[]
  results: ValType[]
  code: WASMCode[]
}

export interface WASMFunctionInstance extends WASMFunction {
  call: (memory: WASMMemory) => void
}

export type WASMTable = {
  // index: funcId
  [key: number]: number
}

export interface WASMModule {
  functions: WASMFunction[]
  table: WASMTable
}

export class WASMMemory {
  // control instruction のみが直接 stack を触るべき
  readonly callStack = new Stack<WASMContext>()
  readonly memory: WASMMemoryValue[] = []
  readonly global: WASMMemoryValue[] = []
  readonly localStack = new Stack<WASMMemoryValue[]>()
  readonly functions: WASMFunctionInstance[]
  readonly table: WASMTable

  constructor(functions: WASMFunctionInstance[], table: WASMTable) {
    this.functions = functions
    this.table = table
  }

  get values(): Stack<WASMMemoryValue> {
    return this.callStack.peek().values
  }

  get local(): WASMMemoryValue[] {
    return this.localStack.peek()
  }
}

// 通常の instruction が操作できるメモリ
export type WASMLocalMemory = Pick<
  WASMMemory,
  "values" | "memory" | "global" | "local"
>

export type PartialInstructionSet<T, S> = (code: T) => Instruction<T, S> | null
