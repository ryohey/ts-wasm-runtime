import { ASTFunction, ValType } from "@ryohey/wasm-ast"
import { WASMMemory, WASMCode, WASMMemoryValue } from "./wasm-memory"
import { range } from "@ryohey/array-helper"
import { numberValue, convertNumber } from "./number/convert"
import { Stack } from "./stack"
import { createWASMVM } from "./wasm-vm"
import { controlInstructionSet } from "./instructions/control"

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface FlowControl {
  break: (level: number) => void
  return: (memory: WASMMemory) => void
}

export enum BreakPosition {
  tail,
  head
}

export const createFunction = (
  fn: Pick<ASTFunction, "parameters" | "body" | "results" | "locals">
) => {
  const block = createBlock(fn.body, fn.results, BreakPosition.tail)

  return (memory: Omit<WASMMemory, "local" | "programCounter">) => {
    const newMemory = {
      ...memory,
      local: [
        // 指定された数のパラメータを values から pop して新しいスタックに積む
        ...range(0, fn.parameters.length).map(_ => memory.values.pop()),

        // local を初期化する
        ...fn.locals
          .map(l => numberValue(l.type, "0"))
          .map(num => convertNumber(num))
      ]
    }

    const flow: FlowControl = {
      return: innerMemory => {
        // 指定された数の戻り値をスタックに積む
        fn.results
          .map(_ => innerMemory.values.pop())
          .forEach(memory.values.push)
      },
      break: () => {
        throw new Error("invalid break")
      }
    }

    block(newMemory, flow)
  }
}

export const createBlock = (
  codes: WASMCode[],
  results: ValType[],
  breakPosition: BreakPosition
) => (memory: Omit<WASMMemory, "programCounter">, flow: FlowControl) => {
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

  const ret = (memory: WASMMemory) => {
    flow.return(memory)
    // vm のループを抜ける
    newMemory.programTerminated = true
  }

  const newFlow = {
    break: br,
    return: ret
  }

  const vm = createWASMVM(controlInstructionSet(newFlow))
  vm(codes, newMemory)

  if (newMemory.programTerminated) {
    return
  }

  // 指定された数の戻り値を pop 後のスタックに積む
  results.map(_ => newMemory.values.pop()).forEach(memory.values.push)
}
