import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { range } from "../../misc/array"
import { popStack } from "./internal"
import { Int32 } from "../../number/Int32"
import { Ref } from "../../vm/vm"

const br = (
  { parameters }: WASMCode,
  memory: WASMMemory,
  programCounter: Ref<number>
) => {
  const nestLevel = parameters[0] as number
  // 指定された回数 pop する
  range(0, nestLevel).forEach(_ => {
    popStack(memory)
  })
  programCounter.value = memory.callStack.peek().labelPosition
}

const callFunc = (memory: WASMMemory, funcId: number) => {
  const { functions, values, callStack } = memory
  const fn = functions[funcId]

  // 指定された数のパラメータを values から pop して新しいスタックに積む
  memory.localStack.push(range(0, fn.parameters.length).map(_ => values.pop()))

  const ctx = new WASMContext(fn.results.length)
  callStack.push(ctx)

  fn.call(memory)

  popStack(memory)
  memory.localStack.pop()
}

export const controlInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMMemory
> = code => {
  switch (code.opcode) {
    case "nop":
      return () => {}
    case "unreachable":
      throw new Error(`not implemented ${code.opcode}`)
    case "block":
      throw new Error("use _push")
    case "loop":
      throw new Error("use _push")
    case "if":
      throw new Error(`not implemented ${code.opcode}`)
    case "br":
      return br
    case "br_if":
      return (code, memory, pc) => {
        const { values } = memory
        if (!Int32.isZero(values.pop() as Int32)) {
          br(code, memory, pc)
        }
      }
    case "br_table":
      throw new Error(`not implemented ${code.opcode}`)
    case "return":
      throw new Error("not to use")
    case "call":
      return ({ parameters }, memory) => {
        const funcId = parameters[0] as number
        callFunc(memory, funcId)
      }
    case "call_indirect":
      return (_, memory) => {
        const idx = memory.values.pop() as Int32
        const funcId = memory.table[idx.toNumber()]
        callFunc(memory, funcId)
      }
  }
  return null
}
