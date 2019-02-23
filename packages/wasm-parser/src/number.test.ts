import { u32, uLEB128Bytes } from "./number"

describe("number", () => {
  it("uLEB128", () => {
    const r = uLEB128Bytes([0b1000_1100, 0b0000_0001, 0b0001_0000], 0)
    expect(r).toStrictEqual([true, [12, 1], 2])
  })

  it("uLEB128", () => {
    const r = uLEB128Bytes([0b1000_1100, 0b1000_0001, 0b0001_0000], 0)
    expect(r).toStrictEqual([true, [12, 1, 16], 3])
  })

  it("u32", () => {
    expect(u32([0b1000_0001, 0b0000_0001], 0)).toStrictEqual([true, 129, 2])
    expect(u32([0xcf, 0x01], 0)).toStrictEqual([true, 207, 2])
  })
})
