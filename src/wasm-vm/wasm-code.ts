import { Instruction, VMMemory } from "../vm/vm"
import { Stack } from "./stack"
import { ValType } from "../wat-parser/types"

export interface WASMCode {
  readonly opcode: string
  readonly parameters: number[]
}

export class WASMContext {
  readonly values = new Stack<number>()
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
  readonly memory: number[] = []
  readonly global: number[] = []
  readonly localStack = new Stack<number[]>()
  readonly functions: WASMFunctionTableEntry[]

  constructor(functions: WASMFunctionTableEntry[]) {
    this.functions = functions
  }

  get values(): Stack<number> {
    return this.callStack.peek().values
  }

  get local(): number[] {
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
