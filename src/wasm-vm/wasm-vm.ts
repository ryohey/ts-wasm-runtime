import { VirtualMachine, InstructionSet } from "../vm/vm"
import {
  WASMCode,
  WASMMemory,
  PartialInstructionSet,
  WASMContext,
  WASMModule
} from "./wasm-code"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { f64InstructionSet } from "./instructions/f64"
import { controlInstructionSet } from "./instructions/control"
import { internalInstructionSet } from "./instructions/internal"
import { Int32 } from "../number/Int32"
import { Int32Value } from "../wat-parser/types"
import { i32InstructionSet } from "./instructions/i32"
import { i64InstructionSet } from "./instructions/i64"
import { f32InstructionSet } from "./instructions/f32"

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
  private readonly vm = createWASMVM()
  private module: WASMModule

  constructor(module: WASMModule) {
    this.module = module
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: Int32Value[]): Int32Value[] {
    const memory = new WASMMemory(this.module.functions)
    const fn = memory.functions.find(t => t.export === name)

    // よろしくないけど適当なポインタに return して止める
    const retAddr = Number.MAX_SAFE_INTEGER
    memory.callStack.push(new WASMContext(retAddr))

    const ctx = new WASMContext(fn.pointer, fn.results.length)
    memory.callStack.push(ctx)
    memory.localStack.push(args.map(v => Int32.int(v)))

    this.vm.run(this.module.program, memory)
    return fn.results.map(_ => memory.values.pop().toInt())
  }
}
