import {
  PartialInstructionSet,
  WASMCode,
  WASMMemory,
  WASMContext
} from "../wasm-code"
import { range } from "../../misc/array"
import { Int32 } from "../../number/Int32"
import { BreakPosition, BreakFunc } from "../../vm/vm"
import { createWASMVM } from "../wasm-vm"
import { ValType } from "../../wat-parser/types"
import { ASTBlock } from "../../wat-parser/block"
import { convertNumber } from "../../number/convert"
import { numberValue } from "../../compiler/compiler"

export const callFunc = (memory: WASMMemory, funcId: number, br: BreakFunc) => {
  const { functions, values } = memory
  const fn = functions[funcId]

  memory.localStack.push([
    // 指定された数のパラメータを values から pop して新しいスタックに積む
    ...range(0, fn.parameters.length).map(_ => values.pop()),

    // local を初期化する
    ...fn.locals
      .map(type => numberValue(type, "0"))
      .map(num => convertNumber(num))
  ])

  runBlock(memory, fn.code, fn.results, BreakPosition.tail, br)

  memory.localStack.pop()
}

const runBlock = (
  memory: WASMMemory,
  codes: WASMCode[],
  results: ValType[],
  breakPosition: BreakPosition,
  break_: (level: number) => void
) => {
  const { callStack, values } = memory

  const ctx = new WASMContext()
  callStack.push(ctx)

  const vm = createWASMVM()
  const breakLevel = vm.run(codes, memory, breakPosition)
  if (breakLevel > 0) {
    break_(breakLevel - 1)
  }

  const returnValues = results.map(_ => ctx.values.pop())

  callStack.pop()
  // 指定された数の戻り値を pop 後のスタックに積む
  returnValues.forEach(values.push)
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
      return (code, memory, _, break_) => {
        const block = code as ASTBlock
        runBlock(memory, block.body, block.results, BreakPosition.tail, break_)
      }
    case "loop":
      return (code, memory, _, break_) => {
        const block = code as ASTBlock
        runBlock(memory, block.body, block.results, BreakPosition.head, break_)
      }
    case "if":
      throw new Error(`not implemented ${code.opType}`)
    case "br":
      return (code, _memory, _pc, break_) => {
        break_(code.parameters[0] as number)
      }
    case "br_if":
      return (code, memory, _pc, break_) => {
        const { values } = memory
        if (!Int32.isZero(values.pop() as Int32)) {
          break_(code.parameters[0] as number)
        }
      }
    case "br_table":
      throw new Error(`not implemented ${code.opType}`)
    case "return":
      return (_, _memory, _pc, br) => {
        br(0)
      }
    case "call":
      return ({ parameters }, memory, _, br) => {
        const funcId = parameters[0] as number
        callFunc(memory, funcId, br)
      }
    case "call_indirect":
      return (_, memory, _pc, br) => {
        const idx = memory.values.pop() as Int32
        const funcId = memory.table[idx.toNumber()]
        callFunc(memory, funcId, br)
      }
  }
  return null
}
