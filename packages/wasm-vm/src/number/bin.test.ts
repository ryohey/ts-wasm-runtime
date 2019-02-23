import { countLeadingZeros, countTrailingZeros } from "./bin"

describe("number", () => {
  it("countLeadingZeros", () => {
    expect(countLeadingZeros("0000", 4)).toBe(4)
    expect(countLeadingZeros("0010", 4)).toBe(2)
    expect(countLeadingZeros("1000", 4)).toBe(0)
  })
  it("countTrailingZeros", () => {
    expect(countTrailingZeros("0000", 4)).toBe(4)
    expect(countTrailingZeros("0010", 4)).toBe(1)
    expect(countTrailingZeros("0100", 4)).toBe(2)
    expect(countTrailingZeros("1000", 4)).toBe(3)
  })
})
