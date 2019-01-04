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
import { ASTAssertReturn } from "../wasm-parser/assert"

type WASMInstructionSet = PartialInstructionSet<WASMCode, WASMMemory>

// Provides WASM instruction set and creates VirtualMachine.
const createWASMVM = (): VirtualMachine<WASMCode, WASMMemory> => {
  const instructionSet = mergeInstructionSet(
    memoryInstructionSet as WASMInstructionSet,
    variableInstructionSet as WASMInstructionSet,
    numericInstructionSet as WASMInstructionSet,
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
  throw new Error(`There is no instruction for ${code}`)
}

export class WASMVirtualMachine {
  private readonly vm = createWASMVM()
  private currentMemory: WASMMemory
  private functionTable: WASMFunctionTableEntry[]

  constructor() {}

  instantiateModule(
    program: WASMCode[],
    functionTable: WASMFunctionTableEntry[]
  ) {
    // TODO: グローバル変数を用意してメモリを生成する
    // TODO: コード内の変数名や関数名を index に置換する
    this.currentMemory = new WASMMemory()
    this.functionTable = functionTable
    this.vm.initialize(program, this.currentMemory)
  }

  // export された関数を呼ぶ
  callFunction(name: string, ...args: number[]) {
    const fn = this.functionTable.find(t => t.export === name)
    const pointer = Number.MAX_SAFE_INTEGER // よろしくないけど適当なポインタで exception を出して止める
    this.currentMemory.callStack.push(new WASMContext(args, pointer))
    this.vm.run(fn.pointer)
    return this.currentMemory
  }

  runTestCase(ast: ASTAssertReturn) {
    const mem = this.callFunction(
      ast.invoke,
      ...ast.args.map(a => a.parameters)
    )
    for (const exp of ast.expected) {
      const received = mem.values.pop()
      if (received !== exp.parameters) {
        throw new Error(`expected ${exp.parameters} but received ${received}`)
      }
    }
  }
}
