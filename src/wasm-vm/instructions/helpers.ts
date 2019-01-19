import { WASMMemoryValue, WASMCode, WASMMemory } from "../wasm-memory"
import { Instruction } from "../../vm/vm"
import { Int32 } from "../../number/Int32"

export const monop = <T extends WASMMemoryValue>(
  fn: (a: T) => T
): Instruction<WASMMemory> => memory => {
  const { values } = memory
  const a = values.pop() as T
  values.push(fn(a))
}

export const binop = <T extends WASMMemoryValue>(
  fn: (a: T, b: T) => T
): Instruction<WASMMemory> => memory => {
  const { values } = memory
  const a = values.pop() as T
  const b = values.pop() as T
  values.push(fn(b, a))
}

export const boolBinop = <T extends WASMMemoryValue>(
  fn: (a: T, b: T) => boolean
) => binop((a, b) => Int32.bool(fn(a as T, b as T)))

export const boolMonop = <T extends WASMMemoryValue>(fn: (a: T) => boolean) =>
  monop(a => Int32.bool(fn(a as T)))
