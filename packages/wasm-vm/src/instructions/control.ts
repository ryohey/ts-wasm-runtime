import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMMemoryValue
} from "../wasm-memory"
import { range } from "@ryohey/array-helper"
import { ValType } from "@ryohey/wasm-ast"
import { Int32, Int64, Float32 } from "../number"
import { convertNumber, numberValue } from "../number/convert"
import { BreakPosition, BreakFunc } from "../vm"
import { createWASMVM } from "../wasm-vm"
import { Stack } from "../stack"

export const callFunc = (memory: WASMMemory, funcId: number, br: BreakFunc) => {
  const { functions, values } = memory
  const fn = functions[funcId]

  const newMemory = {
    ...memory,
    local: [
      // 指定された数のパラメータを values から pop して新しいスタックに積む
      ...range(0, fn.parameters.length).map(_ => values.pop()),

      // local を初期化する
      ...fn.locals
        .map(l => numberValue(l.type, "0"))
        .map(num => convertNumber(num))
    ]
  }

  runBlock(newMemory, fn.body, fn.results, BreakPosition.tail, br)
}

const runBlock = (
  memory: WASMMemory,
  codes: WASMCode[],
  results: ValType[],
  breakPosition: BreakPosition,
  break_: (level: number) => void
) => {
  const newMemory = {
    ...memory,
    values: new Stack<WASMMemoryValue>(),
    programCounter: 0
  }

  const vm = createWASMVM()
  const breakLevel = vm(codes, newMemory, breakPosition)
  if (breakLevel > 0) {
    break_(breakLevel - 1)
  }

  const returnValues = results.map(_ => newMemory.values.pop())

  // 指定された数の戻り値を pop 後のスタックに積む
  returnValues.forEach(memory.values.push)
}

export const controlInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMMemory
> = code => {
  switch (code.opType) {
    case "nop":
      return () => {}
    case "unreachable":
      throw new Error(`not implemented ${code.opType}`)
    case "block":
      return (memory, break_) => {
        runBlock(memory, code.body, code.results, BreakPosition.tail, break_)
      }
    case "loop":
      return (memory, break_) => {
        runBlock(memory, code.body, code.results, BreakPosition.head, break_)
      }
    case "if":
      return (memory, break_) => {
        if (!Int32.isZero(memory.values.pop() as Int32)) {
          runBlock(memory, code.then, code.results, BreakPosition.tail, break_)
        } else {
          runBlock(memory, code.else, code.results, BreakPosition.tail, break_)
        }
      }
    case "br":
      return (_, break_) => {
        break_(code.parameter as number)
      }
    case "br_if":
      return (memory, break_) => {
        const { values } = memory
        if (!Int32.isZero(values.pop() as Int32)) {
          break_(code.parameter as number)
        }
      }
    case "br_table":
      throw new Error(`not implemented ${code.opType}`)
    case "return":
      return (_, br) => br(0)
    case "call":
      return (memory, br) => {
        const funcId = code.parameter as number
        callFunc(memory, funcId, br)
      }
    case "call_indirect":
      return (memory, br) => {
        const idx = memory.values.pop() as Int32
        const funcId = memory.table[idx.toNumber()]
        callFunc(memory, funcId, br)
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
