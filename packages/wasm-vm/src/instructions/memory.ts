import {
  PartialInstructionSet,
  WASMCode,
  WASMLocalMemory,
  WASMMemory
} from "../wasm-memory"
import { Int32, Int64, Float32, Float64 } from "../number"
import { asSigned, unsigned } from "../number/integer"

const writeBytes = (
  bytes: Uint8Array,
  toArray: Uint8Array,
  offset: number
) => {}

// https://webassembly.github.io/spec/core/text/instructions.html#memory-instructions
export const memoryInstructionSet: PartialInstructionSet<
  WASMCode,
  WASMLocalMemory
> = code => {
  switch (code.opType) {
    case "i32.load":
      return ({ memory, values }) => {
        const bytes = memory.slice(code.offset, code.offset + 4)
        values.push(Int32.bytes(bytes))
      }
    case "i64.load":
      return ({ memory, values }) => {
        const bytes = memory.slice(code.offset, code.offset + 8)
        values.push(Int64.bytes(bytes))
      }
    case "f32.load":
      return ({ memory, values }) => {
        const bytes = memory.slice(code.offset, code.offset + 4)
        values.push(Float32.bytes(bytes))
      }
    case "f64.load":
      return ({ memory, values }) => {
        const bytes = memory.slice(code.offset, code.offset + 8)
        values.push(Float64.bytes(bytes))
      }
    case "i32.load8_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int32(asSigned(value, 8)))
      }
    case "i32.load8_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int32(unsigned(value)))
      }
    case "i32.load16_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int32(asSigned(value, 16)))
      }
    case "i32.load16_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int32(value))
      }
    case "i64.load8_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int64(BigInt(asSigned(value, 8))))
      }
    case "i64.load8_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int64(BigInt(value)))
      }
    case "i64.load16_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int64(BigInt(asSigned(value, 16))))
      }
    case "i64.load16_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Int64(BigInt(value)))
      }
    case "f32.load8_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float32(asSigned(value, 8)))
      }
    case "f32.load8_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float32(value))
      }
    case "f32.load16_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float32(asSigned(value, 16)))
      }
    case "f32.load16_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float32(value))
      }
    case "f64.load8_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float64(asSigned(value, 8)))
      }
    case "f64.load8_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float64(value))
      }
    case "f64.load16_s":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float64(asSigned(value, 16)))
      }
    case "f64.load16_u":
      return ({ memory, values }) => {
        const value = memory[code.offset]
        if (typeof value !== "number") {
          throw new Error("type not matched")
        }
        values.push(new Float64(value))
      }
    case "i32.store":
    case "i64.store":
    case "f32.store":
    case "f64.store":
      return ({ memory, values }) =>
        writeBytes(values.pop().toBytes(), memory, code.offset)
    case "i32.store8":
      return ({ memory, values }) =>
        writeBytes(
          values
            .pop()
            .toBytes()
            .slice(3),
          memory,
          code.offset
        )
    case "i32.store16":
      return ({ memory, values }) =>
        writeBytes(
          values
            .pop()
            .toBytes()
            .slice(2),
          memory,
          code.offset
        )
    case "i64.store8":
      return ({ memory, values }) =>
        writeBytes(
          values
            .pop()
            .toBytes()
            .slice(7),
          memory,
          code.offset
        )
    case "i64.store16":
      return ({ memory, values }) =>
        writeBytes(
          values
            .pop()
            .toBytes()
            .slice(6),
          memory,
          code.offset
        )
    case "i64.store32":
      return ({ memory, values }) =>
        writeBytes(
          values
            .pop()
            .toBytes()
            .slice(4),
          memory,
          code.offset
        )
  }
  return null
}
