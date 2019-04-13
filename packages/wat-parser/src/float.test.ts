import { float } from "./float"

describe("float", () => {
  it("parses nan", () => {
    expect(float("nan", 0)).toStrictEqual([true, NaN, 3])
    expect(float("-nan", 0)).toStrictEqual([true, NaN, 4])
    expect(float("-nan:0x200000", 0)).toStrictEqual([true, NaN, 13])
  })

  it("parses inf", () => {
    expect(float("inf", 0)).toStrictEqual([true, Infinity, 3])
    expect(float("-inf", 0)).toStrictEqual([true, -Infinity, 4])
  })

  it("parses hex", () => {
    // TODO: implement
    expect(float("-0x1.921fb6p+2", 0)).toStrictEqual([true, 0, 14])
    expect(float("-0x0p+0", 0)).toStrictEqual([true, 0, 7])
  })
})
