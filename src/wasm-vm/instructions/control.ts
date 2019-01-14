import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { range } from "../../misc/array"
import { popStack } from "./internal"

const br = ({ parameters }: WASMCode, memory: WASMMemory) => {
  const nestLevel = parameters[0] as number
  // 指定された回数 pop する
  range(0, nestLevel).forEach(_ => {
    popStack(memory)
  })
  memory.programCounter = memory.callStack.peek().labelPosition
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
      return (code, memory) => {
        const { values } = memory
        if (values.pop() !== 0) {
          br(code, memory)
        }
      }
    case "br_table":
      throw new Error(`not implemented ${code.opcode}`)
    case "return":
      throw new Error("use _ret")
    case "call":
      return ({ parameters }, memory) => {
        const { functions, values, callStack } = memory
        const funcId = parameters[0] as number
        const fn = functions[funcId]

        // 指定された数のパラメータを values から pop して新しいスタックに積む
        memory.localStack.push(
          range(0, fn.parameters.length).map(_ => values.pop())
        )

        const ctx = new WASMContext(fn.pointer, fn.results.length)
        callStack.push(ctx)
      }
    case "call_indirect":
      throw new Error(`not implemented ${code.opcode}`)
  }
  return null
}
