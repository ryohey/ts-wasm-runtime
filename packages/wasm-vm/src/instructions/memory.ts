import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory,
  WASMMemoryValue
} from "../wasm-memory"
import { Int32, Int64, Float32, Float64 } from "../number"
import { Op } from "@ryohey/wasm-ast"
import { Stack } from "../stack"

const writeBytes = (bytes: Uint8Array, toArray: Uint8Array, addr: number) => {
  bytes.forEach((v, i) => (toArray[addr + i] = v))
}

const load8u = (
  values: Stack<WASMMemoryValue>,
  memory: Uint8Array,
  code: Op.Mem<any>
) => {
  const addr = values.pop().toNumber() + (code.offset || 0)
  const data = new DataView(memory)
  return data.getUint8(addr)
}

const load8s = (
  values: Stack<WASMMemoryValue>,
  memory: Uint8Array,
  code: Op.Mem<any>
) => {
  const addr = values.pop().toNumber() + (code.offset || 0)
  const data = new DataView(memory)
  return data.getInt8(addr)
}

const load16u = (
  values: Stack<WASMMemoryValue>,
  memory: Uint8Array,
  code: Op.Mem<any>
) => {
  const addr = values.pop().toNumber() + (code.offset || 0)
  const data = new DataView(memory)
  return data.getUint16(addr)
}

const load16s = (
  values: Stack<WASMMemoryValue>,
  memory: Uint8Array,
  code: Op.Mem<any>
) => {
  const addr = values.pop().toNumber() + (code.offset || 0)
  const data = new DataView(memory)
  return data.getInt16(addr)
}

const load32u = (
  values: Stack<WASMMemoryValue>,
  memory: Uint8Array,
  code: Op.Mem<any>
) => {
  const addr = values.pop().toNumber() + (code.offset || 0)
  const data = new DataView(memory)
  return data.getUint32(addr)
}

const load32s = (
  values: Stack<WASMMemoryValue>,
  memory: Uint8Array,
  code: Op.Mem<any>
) => {
  const addr = values.pop().toNumber() + (code.offset || 0)
  const data = new DataView(memory)
  return data.getInt32(addr)
}

// https://webassembly.github.io/spec/core/text/instructions.html#memory-instructions
export const memoryInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "i32.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        const bytes = memory.slice(addr, addr + 4)
        values.push(Int32.bytes(bytes))
      }
    case "i64.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        const bytes = memory.slice(addr, addr + 8)
        values.push(Int64.bytes(bytes))
      }
    case "f32.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        const bytes = memory.slice(addr, addr + 4)
        values.push(Float32.bytes(bytes))
      }
    case "f64.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        const bytes = memory.slice(addr, addr + 8)
        values.push(Float64.bytes(bytes))
      }
    case "i32.load8_s":
      return ({ memory, values }) =>
        values.push(new Int32(load8s(values, memory, code)))
    case "i32.load8_u":
      return ({ memory, values }) =>
        values.push(new Int32(load8u(values, memory, code)))
    case "i32.load16_s":
      return ({ memory, values }) =>
        values.push(new Int32(load16s(values, memory, code)))
    case "i32.load16_u":
      return ({ memory, values }) =>
        values.push(new Int32(load16u(values, memory, code)))
    case "i64.load8_s":
      return ({ memory, values }) =>
        values.push(new Int64(BigInt(load8s(values, memory, code))))
    case "i64.load8_u":
      return ({ memory, values }) =>
        values.push(new Int64(BigInt(load8u(values, memory, code))))
    case "i64.load16_s":
      return ({ memory, values }) =>
        values.push(new Int64(BigInt(load16s(values, memory, code))))
    case "i64.load16_u":
      return ({ memory, values }) =>
        values.push(new Int64(BigInt(load16u(values, memory, code))))
    case "i64.load32_s":
      return ({ memory, values }) =>
        values.push(new Int64(BigInt(load32s(values, memory, code))))
    case "i64.load32_u":
      return ({ memory, values }) =>
        values.push(new Int64(BigInt(load32u(values, memory, code))))
    case "f32.load8_s":
      return ({ memory, values }) =>
        values.push(new Float32(load8s(values, memory, code)))
    case "f32.load8_u":
      return ({ memory, values }) =>
        values.push(new Float32(load8u(values, memory, code)))
    case "f32.load16_s":
      return ({ memory, values }) =>
        values.push(new Float32(load16s(values, memory, code)))
    case "f32.load16_u":
      return ({ memory, values }) =>
        values.push(new Float32(load16u(values, memory, code)))
    case "f64.load8_s":
      return ({ memory, values }) =>
        values.push(new Float64(load8s(values, memory, code)))
    case "f64.load8_u":
      return ({ memory, values }) =>
        values.push(new Float64(load8u(values, memory, code)))
    case "f64.load16_s":
      return ({ memory, values }) =>
        values.push(new Float64(load16s(values, memory, code)))
    case "f64.load16_u":
      return ({ memory, values }) =>
        values.push(new Float64(load16u(values, memory, code)))
    case "i32.store":
    case "i64.store":
    case "f32.store":
    case "f64.store":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        writeBytes(num.toBytes(), memory, addr)
      }
    case "i32.store8":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        writeBytes(num.toBytes().slice(0, 1), memory, addr)
      }
    case "i32.store16":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        writeBytes(num.toBytes().slice(0, 2), memory, addr)
      }
    case "i64.store8":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        writeBytes(num.toBytes().slice(0, 1), memory, addr)
      }
    case "i64.store16":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        writeBytes(num.toBytes().slice(0, 2), memory, addr)
      }
    case "i64.store32":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        writeBytes(num.toBytes().slice(0, 4), memory, addr)
      }
  }
  return null
}
