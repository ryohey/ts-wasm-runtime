import { Instruction } from "../vm/vm"
import { Stack } from "./stack"
import { ValType } from "../wasm-parser/types"

export interface WASMCode {
  readonly opcode: string
  readonly parameters: number[]
}

export class WASMContext {
  readonly values = new Stack<number>()
  readonly local: number[]
  readonly returnAddress: number

  constructor(returnAddress: number, local: number[] = []) {
    this.returnAddress = returnAddress
    this.local = local
  }
}

export interface WASMFunctionTableEntry {
  export: string
  identifier: string
  pointer: number
  parameters: ValType[]
  locals: ValType[]
}

export class WASMMemory {
  // control instruction のみが直接 stack を触るべき
  readonly callStack = new Stack<WASMContext>()
  readonly memory: number[] = []
  readonly global: number[] = []
  readonly functions: WASMFunctionTableEntry[]

  constructor(functions: WASMFunctionTableEntry[]) {
    this.callStack.push(new WASMContext(0))
    this.functions = functions
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
