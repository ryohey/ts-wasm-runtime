import { VirtualMachine, InstructionSet } from "../vm/vm"
import {
  WASMCode,
  WASMMemory,
  PartialInstructionSet,
  WASMContext,
  WASMFunctionTableEntry,
  WASMModule
} from "./wasm-code"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { numericInstructionSet } from "./instructions/numeric"
import { controlInstructionSet } from "./instructions/control"
import { internalInstructionSet } from "./instructions/internal"
import { Int32 } from "../number/Int32"

type WASMInstructionSet = PartialInstructionSet<WASMCode, WASMMemory>

// Provides WASM instruction set and creates VirtualMachine.
const createWASMVM = (): VirtualMachine<WASMCode, WASMMemory> => {
  const instructionSet = mergeInstructionSet(
    memoryInstructionSet as WASMInstructionSet,
    variableInstructionSet as WASMInstructionSet,
    numericInstructionSet as WASMInstructionSet,
    internalInstructionSet as WASMInstructionSet,
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
  private readonly vm = createWASMVM()
  private module: WASMModule

  constructor(module: WASMModule) {
    this.module = module
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: number[]) {
    const memory = new WASMMemory(this.module.functions)
    const fn = memory.functions.find(t => t.export === name)

    // よろしくないけど適当なポインタに return して止める
    const retAddr = Number.MAX_SAFE_INTEGER
    memory.callStack.push(new WASMContext(retAddr))

    const ctx = new WASMContext(fn.pointer, fn.results.length)
    memory.callStack.push(ctx)

    // TODO: convert to function's parameter types
    memory.localStack.push(args.map(v => new Int32(v)))

    this.vm.run(this.module.program, memory)

    const result = fn.results.map(_ => memory.values.pop().toNumber())
    return result.length === 1 ? result[0] : result
  }
}
