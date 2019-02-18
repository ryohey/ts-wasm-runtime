import { ASTElem, ASTGlobal, ASTModule, NumberValue } from "@ryohey/wasm-ast"
import { callFunc } from "./instructions/control"
import { f32InstructionSet } from "./instructions/f32"
import { f64InstructionSet } from "./instructions/f64"
import { i32InstructionSet } from "./instructions/i32"
import { i64InstructionSet } from "./instructions/i64"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { Int32 } from "./number"
import { convertNumber } from "./number/convert"
import { Stack } from "./stack"
import { InstructionSet, virtualMachine } from "./vm"
import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMMemoryValue,
  WASMTable
} from "./wasm-memory"

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

const createTable = (elems: ASTElem[]) => {
  const table: WASMTable = {}
  elems.forEach(e => {
    const offset = Int32.obj(e.offset).toNumber()
    e.funcIds.forEach((id, i) => {
      table[offset + i] = id as number
    })
  })
  return table
}

const createGlobalMemory = (globals: ASTGlobal[]) =>
  globals.map(g => convertNumber(g.initialValue))

export class WASMVirtualMachine {
  private module: ASTModule
  private table: WASMTable
  private global: WASMMemoryValue[]

  constructor(module: ASTModule) {
    this.module = module
    this.table = createTable(module.elems)
    this.global = createGlobalMemory(module.globals)
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: NumberValue[]): NumberValue[] {
    const { functions } = this.module
    const funcId = functions.findIndex(t => t.export === name)
    const fn = functions[funcId]

    const memory: WASMMemory = {
      functions,
      table: this.table,
      values: new Stack<WASMMemoryValue>(),
      memory: [],
      local: [],
      global: this.global,
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
