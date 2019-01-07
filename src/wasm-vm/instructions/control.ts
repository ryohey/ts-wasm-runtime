import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { range } from "../../misc/array"
import { popStack } from "./internal"

const br = ({ parameters: [nestLevel] }: WASMCode, memory: WASMMemory) => {
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
      return null
    case "block":
      return null
    case "loop":
      return null
    case "if":
      return null
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
      return null
    case "return":
      return () => {
        // do nothing
        // the compiler use _pop and _ret
      }
    case "call":
      return ({ parameters: [funcId] }, memory) => {
        const { functions, values, callStack } = memory
        const fn = functions[funcId]

        // 指定された数のパラメータを values から pop して新しいスタックに積む
        memory.localStack.push(
          range(0, fn.parameters.length).map(_ => values.pop())
        )

        const ctx = new WASMContext(fn.pointer, fn.results.length)
        callStack.push(ctx)
      }
    case "call_indirect":
      return null
  }
  return null
}
