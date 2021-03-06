import { NumberValue, Op } from "@ryohey/wasm-ast"
import { f32InstructionSet } from "./instructions/f32"
import { f64InstructionSet } from "./instructions/f64"
import { i32InstructionSet } from "./instructions/i32"
import { i64InstructionSet } from "./instructions/i64"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
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
import { createFunction } from "./block"
import { WASMElem, WASMGlobal, WASMFunction, WASMModule } from "./module"

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

const createTable = (elems: WASMElem[]) => {
  const table: WASMTable = {}
  elems.forEach(e => {
    e.funcIds.forEach((id, i) => {
      // TODO: support global.get
      const init = e.offset as Op.Const
      const offset = convertNumber(init.parameter).value as number
      table[offset + i] = id
    })
  })
  return table
}

const createGlobalMemory = (globals: WASMGlobal[]) =>
  globals.map(g => {
    // TODO: support global.get
    const init = g.init as Op.Const
    return convertNumber(init.parameter)
  })

export class WASMVirtualMachine {
  private functions: WASMFunction[]
  private table: WASMTable
  private global: WASMMemoryValue[]

  constructor(module: WASMModule) {
    this.functions = module.functions
    this.table = createTable(module.elems)
    this.global = createGlobalMemory(module.globals)
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: NumberValue[]): NumberValue[] {
    const { functions } = this
    const funcId = functions.findIndex(t => t.export === name)
    const fn = functions[funcId]

    const memory: WASMMemory = {
      functions,
      table: this.table,
      values: new Stack<WASMMemoryValue>(),
      memory: new DataView(new ArrayBuffer(1024)),
      local: [],
      global: this.global,
      programCounter: 0,
      programTerminated: false
    }

    args
      .map(convertNumber)
      .reverse()
      .forEach(memory.values.push)

    createFunction(fn)(memory)

    return fn.results.map(_ => memory.values.pop().toObject())
  }
}
