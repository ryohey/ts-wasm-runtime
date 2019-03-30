import { asSigned } from "./integer"

describe("integer", () => {
  it("asSigned", () => {
    expect(asSigned(0b1000_0000, 8)).toBe(-128)
    expect(asSigned(0b0111_1111, 8)).toBe(127)
  })
})
