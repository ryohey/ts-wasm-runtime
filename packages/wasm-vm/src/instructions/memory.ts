import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory
} from "../wasm-memory"
import { Int32, Int64, Float32, Float64 } from "../number"

const bigintToDataView = (num: bigint) => {
  const data = new DataView(new ArrayBuffer(8))
  data.setBigInt64(0, num, true)
  return data
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
        values.push(new Int32(memory.getInt32(addr, true)))
      }
    case "i64.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(memory.getBigInt64(addr, true)))
      }
    case "f32.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float32(memory.getFloat32(addr, true)))
      }
    case "f64.load":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float64(memory.getFloat64(addr, true)))
      }
    case "i32.load8_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int32(memory.getInt8(addr)))
      }
    case "i32.load8_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int32(memory.getUint8(addr)))
      }
    case "i32.load16_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int32(memory.getInt16(addr, true)))
      }
    case "i32.load16_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int32(memory.getUint16(addr, true)))
      }
    case "i64.load8_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(BigInt(memory.getInt8(addr))))
      }
    case "i64.load8_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(BigInt(memory.getUint8(addr))))
      }
    case "i64.load16_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(BigInt(memory.getInt16(addr, true))))
      }
    case "i64.load16_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(BigInt(memory.getUint16(addr, true))))
      }
    case "i64.load32_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(BigInt(memory.getInt32(addr, true))))
      }
    case "i64.load32_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Int64(BigInt(memory.getUint32(addr, true))))
      }
    case "f32.load8_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float32(memory.getInt8(addr)))
      }
    case "f32.load8_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float32(memory.getUint8(addr)))
      }
    case "f32.load16_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float32(memory.getInt16(addr, true)))
      }
    case "f32.load16_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float32(memory.getUint16(addr, true)))
      }
    case "f64.load8_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float64(memory.getInt8(addr)))
      }
    case "f64.load8_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float64(memory.getUint8(addr)))
      }
    case "f64.load16_s":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float64(memory.getInt16(addr, true)))
      }
    case "f64.load16_u":
      return ({ memory, values }) => {
        const addr = values.pop().toNumber() + (code.offset || 0)
        values.push(new Float64(memory.getUint16(addr, true)))
      }
    case "i32.store":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setInt32(addr, num.toNumber(), true)
      }
    case "i64.store":
      return ({ memory, values }) => {
        const num = values.pop() as Int64
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setBigInt64(addr, num.value, true)
      }
    case "f32.store":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setFloat32(addr, num.toNumber(), true)
      }
    case "f64.store":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setFloat64(addr, num.toNumber(), true)
      }
    case "i32.store8":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setInt8(addr, num.toNumber())
      }
    case "i32.store16":
      return ({ memory, values }) => {
        const num = values.pop()
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setInt16(addr, num.toNumber(), true)
      }
    case "i64.store8":
      return ({ memory, values }) => {
        const num = values.pop() as Int64
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setInt8(addr, bigintToDataView(num.value).getInt8(0))
      }
    case "i64.store16":
      return ({ memory, values }) => {
        const num = values.pop() as Int64
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setInt16(
          addr,
          bigintToDataView(num.value).getInt16(0, true),
          true
        )
      }
    case "i64.store32":
      return ({ memory, values }) => {
        const num = values.pop() as Int64
        const addr = values.pop().toNumber() + (code.offset || 0)
        memory.setInt32(
          addr,
          bigintToDataView(num.value).getInt32(0, true),
          true
        )
      }
  }
  return null
}
