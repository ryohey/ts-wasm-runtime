import { VirtualMachine, InstructionSet } from "./vm"
import { WASMCode, WASMMemory, PartialInstructionSet } from "./wasm-code"
import { memoryInstructionSet } from "./instructions/memory"
import { variableInstructionSet } from "./instructions/variable"
import { numericInstructionSet } from "./instructions/numeric"
import { controlInstructionSet } from "./instructions/control"

type WASMInstructionSet = PartialInstructionSet<WASMCode, WASMMemory>

// Provides WASM instruction set and creates VirtualMachine.
export const createWASMVM = (): VirtualMachine<WASMCode, WASMMemory> => {
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
