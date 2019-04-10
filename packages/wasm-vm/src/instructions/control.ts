import { ValType } from "@ryohey/wasm-ast"
import { Int32, Int64 } from "../number"
import { PartialInstructionSet, WASMCode, WASMMemory } from "../wasm-memory"
import {
  BreakPosition,
  createBlock,
  createFunction,
  FlowControl
} from "../block"

const callFunc = (memory: WASMMemory, funcId: number) => {
  const { functions } = memory
  const fn = functions[funcId]
  createFunction(fn)(memory)
}

const runBlock = (
  memory: WASMMemory,
  codes: WASMCode[],
  results: ValType[],
  breakPosition: BreakPosition,
  flow: FlowControl
) => {
  createBlock(codes, results, breakPosition)(memory, flow)
}

export const controlInstructionSet = (
  flow: FlowControl
): PartialInstructionSet<WASMCode, WASMMemory> => code => {
  switch (code.opType) {
    case "nop":
      return () => {}
    case "unreachable":
      throw new Error(`not implemented ${code.opType}`)
    case "block":
      return memory => {
        runBlock(memory, code.body, code.results, BreakPosition.tail, flow)
      }
    case "loop":
      return memory => {
        runBlock(memory, code.body, code.results, BreakPosition.head, flow)
      }
    case "if":
      return memory => {
        if (!Int32.isZero(memory.values.pop() as Int32)) {
          runBlock(memory, code.then, code.results, BreakPosition.tail, flow)
        } else {
          runBlock(memory, code.else, code.results, BreakPosition.tail, flow)
        }
      }
    case "br":
      return () => {
        flow.break(code.parameter as number)
      }
    case "br_if":
      return memory => {
        const { values } = memory
        if (!Int32.isZero(values.pop() as Int32)) {
          flow.break(code.parameter as number)
        }
      }
    case "br_table":
      return memory => {
        const labelIds = code.parameters as number[]
        const { values } = memory
        const idx = (values.pop() as Int32).value
        const label =
          idx < labelIds.length && idx >= 0
            ? labelIds[idx]
            : labelIds[labelIds.length - 1]
        flow.break(label)
      }
    case "return":
      return memory => flow.return(memory)
    case "call":
      return memory => {
        const funcId = code.parameter as number
        callFunc(memory, funcId)
      }
    case "call_indirect":
      return memory => {
        const idx = memory.values.pop() as Int32
        const funcId = memory.table[idx.value]
        callFunc(memory, funcId)
      }
    case "select":
      return memory => {
        const { values } = memory
        const first = values.pop()
        let condition: boolean
        if (first instanceof Int32) {
          condition = Int32.isZero(first as Int32)
        } else if (first instanceof Int64) {
          condition = Int64.isZero(first as Int64)
        } else {
          throw new Error(`unsupported type: ${typeof first}`)
        }
        const lhs = values.pop()
        const rhs = values.pop()
        values.push(condition ? lhs : rhs)
      }
  }
  return null
}
