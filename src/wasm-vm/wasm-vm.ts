import { VirtualMachine, InstructionSet } from "../vm/vm"
import {
  WASMCode,
  WASMMemory,
  PartialInstructionSet,
  WASMContext,
  WASMModule,
  WASMFunctionInstance,
  WASMFunction,
  WASMTable
} from "./wasm-code"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { f64InstructionSet } from "./instructions/f64"
import { controlInstructionSet } from "./instructions/control"
import { internalInstructionSet } from "./instructions/internal"
import { NumberValue } from "../wat-parser/types"
import { i32InstructionSet } from "./instructions/i32"
import { i64InstructionSet } from "./instructions/i64"
import { f32InstructionSet } from "./instructions/f32"
import { convertNumber } from "../number/convert"

type WASMInstructionSet = PartialInstructionSet<WASMCode, WASMMemory>

// Provides WASM instruction set and creates VirtualMachine.
const createWASMVM = (): VirtualMachine<WASMCode, WASMMemory> => {
  const instructionSet = mergeInstructionSet(
    memoryInstructionSet as WASMInstructionSet,
    variableInstructionSet as WASMInstructionSet,
    i32InstructionSet as WASMInstructionSet,
    i64InstructionSet as WASMInstructionSet,
    f32InstructionSet as WASMInstructionSet,
    f64InstructionSet as WASMInstructionSet,
    internalInstructionSet,
    controlInstructionSet
  )
  return new VirtualMachine(instructionSet)
}

const mergeInstructionSet = <T, S>(
  ...instructioSets: PartialInstructionSet<T, S>[]
): InstructionSet<T, S> => code => {
  for (const is of instructioSets) {
    const i = is(code)
    if (i !== null) {
      return i
    }
  }
  throw new Error(`There is no instruction for ${JSON.stringify(code)}`)
}

export class WASMVirtualMachine {
  private table: WASMTable
  private functions: WASMFunctionInstance[]

  constructor(module: WASMModule) {
    this.table = module.table
    this.functions = module.functions.map(this.createFunction)
  }

  createFunction = (fn: WASMFunction): WASMFunctionInstance => {
    return {
      ...fn,
      call: (memory: WASMMemory) => {
        const vm = createWASMVM()
        vm.run(fn.code, memory)
      }
    }
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: NumberValue[]): NumberValue[] {
    const memory = new WASMMemory(this.functions, this.table)
    const funcId = memory.functions.findIndex(t => t.export === name)
    const fn = memory.functions[funcId]

    const ctx = new WASMContext(fn.results.length)
    memory.callStack.push(ctx)
    memory.localStack.push(args.map(convertNumber))

    this.functions[funcId].call(memory)

    return fn.results.map(_ => memory.values.pop().toObject())
  }
}
