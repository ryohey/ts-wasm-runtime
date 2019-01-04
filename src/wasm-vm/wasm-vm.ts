import { VirtualMachine, InstructionSet } from "../vm/vm"
import {
  WASMCode,
  WASMMemory,
  PartialInstructionSet,
  WASMContext,
  WASMFunctionTableEntry
} from "./wasm-code"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { numericInstructionSet } from "./instructions/numeric"
import { controlInstructionSet } from "./instructions/control"
import { internalInstructionSet } from "./instructions/internal"

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
  private currentMemory: WASMMemory

  constructor() {}

  instantiateModule(
    program: WASMCode[],
    functionTable: WASMFunctionTableEntry[]
  ) {
    // TODO: グローバル変数を用意してメモリを生成する
    // TODO: コード内の変数名や関数名を index に置換する
    this.currentMemory = new WASMMemory(functionTable)
    this.vm.initialize(program, this.currentMemory)
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: number[]) {
    const fn = this.currentMemory.functions.find(t => t.export === name)

    // pass parameters
    const ctx = new WASMContext()
    args.forEach(a => ctx.values.push(a))

    // よろしくないけど適当なポインタに return して止める
    const retAddr = Number.MAX_SAFE_INTEGER
    ctx.values.push(retAddr)

    this.currentMemory.callStack.push(ctx)
    this.vm.runInstruction({
      opcode: "_jump",
      parameters: [fn.pointer]
    })
    this.vm.run(this.vm.programCounter)
    return this.currentMemory
  }
}
