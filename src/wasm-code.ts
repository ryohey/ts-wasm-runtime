import { Instruction } from "./vm"
import { Stack } from "./stack"

export interface WASMCode {
  readonly opcode: string
  readonly value: number
}

export class WASMContext {
  readonly values = new Stack<number>()
  readonly local: number[] = []
  readonly returnAddress: number

  constructor(local: number[], returnAddress: number) {
    this.local = local
    this.returnAddress = returnAddress
  }
}

export class WASMMemory {
  // control instruction のみが直接 stack を触るべき
  readonly callStack = new Stack<WASMContext>()
  readonly memory: number[] = []
  readonly global: number[] = []

  constructor() {
    this.callStack.push(new WASMContext([], 0))
  }

  get local(): number[] {
    return this.callStack.peek().local
  }

  get values(): Stack<number> {
    return this.callStack.peek().values
  }
}

// 通常の instruction が操作できるメモリ
export type WASMLocalMemory = Pick<
  WASMMemory,
  "values" | "memory" | "global" | "local"
>

export type PartialInstructionSet<T, S> = (code: T) => Instruction<T, S> | null
