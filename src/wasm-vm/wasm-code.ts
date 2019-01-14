import { Instruction, VMMemory } from "../vm/vm"
import { Stack } from "./stack"
import {
  ValType,
  Int32Value,
  Int64Value,
  Float32Value,
  Float64Value
} from "../wat-parser/types"
import { Int32 } from "../number/Int32"

export interface WASMCode {
  readonly opcode: string
  readonly parameters: (
    | number
    | Int32Value
    | Int64Value
    | Float32Value
    | Float64Value)[]
}

export type WASMMemoryValue = Int32

export class WASMContext {
  readonly values = new Stack<WASMMemoryValue>()
  readonly labelPosition: number
  readonly resultLength: number
  public programCounter: number

  constructor(
    programCounter: number,
    resultLength: number = 0,
    labelPosition: number = 0
  ) {
    this.programCounter = programCounter
    this.resultLength = resultLength
    this.labelPosition = labelPosition
  }
}

export type WASMFunctionTableEntry = {
  export: string
  identifier: string
  pointer: number
  parameters: ValType[]
  locals: ValType[]
  results: ValType[]
}

export interface WASMModule {
  program: WASMCode[]
  functions: WASMFunctionTableEntry[]
}

export class WASMMemory implements VMMemory {
  // control instruction のみが直接 stack を触るべき
  readonly callStack = new Stack<WASMContext>()
  readonly memory: WASMMemoryValue[] = []
  readonly global: WASMMemoryValue[] = []
  readonly localStack = new Stack<WASMMemoryValue[]>()
  readonly functions: WASMFunctionTableEntry[]

  constructor(functions: WASMFunctionTableEntry[]) {
    this.functions = functions
  }

  get values(): Stack<WASMMemoryValue> {
    return this.callStack.peek().values
  }

  get local(): WASMMemoryValue[] {
    return this.localStack.peek()
  }

  get programCounter(): number {
    return this.callStack.peek().programCounter
  }

  set programCounter(val: number) {
    this.callStack.peek().programCounter = val
  }
}

// 通常の instruction が操作できるメモリ
export type WASMLocalMemory = Pick<
  WASMMemory,
  "values" | "memory" | "global" | "local"
>

export type PartialInstructionSet<T, S> = (code: T) => Instruction<T, S> | null
