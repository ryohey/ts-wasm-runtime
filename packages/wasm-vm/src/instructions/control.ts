import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMMemoryValue
} from "../wasm-memory"
import { range } from "@ryohey/array-helper"
import { ValType } from "@ryohey/wasm-ast"
import { Int32, Int64 } from "../number"
import { convertNumber, numberValue } from "../number/convert"
import { createWASMVM } from "../wasm-vm"
import { Stack } from "../stack"

export const callFunc = (memory: WASMMemory, funcId: number) => {
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

  const flow: FlowControl = {
    return: innerMemory => {
      // 指定された数の戻り値をスタックに積む
      fn.results.map(_ => innerMemory.values.pop()).forEach(memory.values.push)
    },
    break: () => {
      throw new Error("invalid break")
    }
  }

  runBlock(newMemory, fn.body, fn.results, BreakPosition.tail, flow)
}

interface FlowControl {
  break: (level: number) => void
  return: (memory: WASMMemory) => void
}

enum BreakPosition {
  tail,
  head
}

const runBlock = (
  memory: WASMMemory,
  codes: WASMCode[],
  results: ValType[],
  breakPosition: BreakPosition,
  flow: FlowControl
) => {
  const newMemory = {
    ...memory,
    values: new Stack<WASMMemoryValue>(),
    programCounter: 0
  }

  // create break instruction
  const br = (level: number) => {
    newMemory.programCounter = (() => {
      switch (breakPosition) {
        case BreakPosition.tail:
          return codes.length
        case BreakPosition.head:
          return 0
      }
    })()
    if (level > 0) {
      flow.break(level - 1)
    }
  }

  let isReturn = false
  const ret = (memory: WASMMemory) => {
    flow.return(memory)
    isReturn = true
  }

  const newFlow = {
    break: br,
    return: ret
  }

  const vm = createWASMVM(controlInstructionSet(newFlow))
  vm(codes, newMemory)

  if (isReturn) {
    return
  }

  // 指定された数の戻り値を pop 後のスタックに積む
  results.map(_ => newMemory.values.pop()).forEach(memory.values.push)
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
        const idx = (values.pop() as Int32).toNumber()
        const label =
          idx < labelIds.length ? labelIds[idx] : labelIds[labelIds.length - 1]
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
        const funcId = memory.table[idx.toNumber()]
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
