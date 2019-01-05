import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { range } from "../../misc/array"
import { Instruction } from "../../vm/vm"

const popStack: Instruction<WASMCode, WASMMemory> = (
  _,
  { callStack, values }
) => {
  const { resultLength } = callStack.peek()
  // 指定された数の戻り値を pop 後のスタックに積む
  const returnValues = range(0, resultLength).map(_ => values.pop())
  callStack.pop()
  const ctx = callStack.peek()
  returnValues.forEach(ctx.values.push)
}

// Internal instructions generated by compiler
export const internalInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMMemory
> = code => {
  switch (code.opcode) {
    case "_push":
      return (code, memory) => {
        const { callStack, programCounter } = memory
        callStack.push(new WASMContext(programCounter, [], code.parameters[0]))
      }
    case "_ret":
      return popStack
    case "_pop":
      return (code, memory) => {
        const pc = memory.programCounter
        popStack(code, memory)
        // pop 後に return しないでそのまま次のコードを読み込む
        memory.programCounter = pc
      }
  }
  return null
}
