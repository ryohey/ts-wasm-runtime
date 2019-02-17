import { virtualMachine, InstructionSet } from "./vm"
import {
  WASMCode,
  WASMMemory,
  PartialInstructionSet,
  WASMModule,
  WASMTable,
  WASMMemoryValue
} from "./wasm-memory"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { f64InstructionSet } from "./instructions/f64"
import { controlInstructionSet, callFunc } from "./instructions/control"
import { i32InstructionSet } from "./instructions/i32"
import { i64InstructionSet } from "./instructions/i64"
import { f32InstructionSet } from "./instructions/f32"
import { convertNumber } from "./number/convert"
import { Stack } from "./stack"
import { ASTFunction } from "@ryohey/wasm-ast"
import { NumberValue } from "@ryohey/wasm-ast"

type WASMInstructionSet = PartialInstructionSet<WASMCode, WASMMemory>

const mergeInstructionSet = <T, S>(
  instructioSets: PartialInstructionSet<T, S>[]
): InstructionSet<T, S> => code => {
  for (const is of instructioSets) {
    const i = is(code)
    if (i !== null) {
      return i
    }
  }
  throw new Error(`There is no instruction for ${JSON.stringify(code)}`)
}

const baseInstructionSet = [
  memoryInstructionSet as WASMInstructionSet,
  variableInstructionSet as WASMInstructionSet,
  i32InstructionSet as WASMInstructionSet,
  i64InstructionSet as WASMInstructionSet,
  f32InstructionSet as WASMInstructionSet,
  f64InstructionSet as WASMInstructionSet
]

// Provides WASM instruction set and creates VirtualMachine.
export const createWASMVM = (controlInstructionSet: WASMInstructionSet) =>
  virtualMachine(
    mergeInstructionSet([...baseInstructionSet, controlInstructionSet])
  )

export class WASMVirtualMachine {
  private table: WASMTable
  private functions: ASTFunction[]

  constructor(module: WASMModule) {
    this.table = module.table
    this.functions = module.functions
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: NumberValue[]): NumberValue[] {
    const funcId = this.functions.findIndex(t => t.export === name)
    const fn = this.functions[funcId]

    const memory: WASMMemory = {
      functions: this.functions,
      table: this.table,
      values: new Stack<WASMMemoryValue>(),
      memory: [],
      local: [],
      global: [],
      programCounter: 0,
      programTerminated: false
    }

    args
      .map(convertNumber)
      .reverse()
      .forEach(memory.values.push)

    callFunc(memory, funcId)

    return fn.results.map(_ => memory.values.pop().toObject())
  }
}
