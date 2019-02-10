import * as assert from "assert"
import { u32, uLEB128Bytes } from "./number"

describe("number", () => {
  it("uLEB128", () => {
    const r = uLEB128Bytes([0b1000_1100, 0b0000_0001, 0b0001_0000], 0)
    assert.deepStrictEqual(r, [true, [12, 1], 2])
  })

  it("uLEB128", () => {
    const r = uLEB128Bytes([0b1000_1100, 0b1000_0001, 0b0001_0000], 0)
    assert.deepStrictEqual(r, [true, [12, 1, 16], 3])
  })

  it("u32", () => {
    assert.deepStrictEqual(u32([0b1000_0001, 0b0000_0001], 0), [true, 129, 2])
    assert.deepStrictEqual(u32([0xcf, 0x01], 0), [true, 207, 2])
  })
})
