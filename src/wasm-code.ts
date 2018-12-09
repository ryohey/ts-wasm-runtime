import { Instruction } from "./vm"
import { Stack } from "./stack"

export interface WASMCode {
  opcode: string
  value: number
}

export class WASMContext {
  values = new Stack<number>()
  local: number[] = []
}

export class WASMMemory {
  // control instruction のみが直接 stack を触るべき
  stack = new Stack<WASMContext>()

  memory: number[] = []
  global: number[] = []

  constructor() {
    this.stack.push(new WASMContext())
  }

  get local(): number[] {
    return this.stack.peek().local
  }

  get values(): Stack<number> {
    return this.stack.peek().values
  }
}

export type PartialInstructionSet<T, S> = (code: T) => Instruction<T, S> | null
