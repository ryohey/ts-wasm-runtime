import { floatNum, hexFloatNum, nan, inf, hexNan } from "./float"

describe("float", () => {
  it("parses", () => {
    expect(hexFloatNum("-0x0p+0", 0)).toStrictEqual([
      true,
      { exponent: "+0", fraction: "-0x0" },
      7
    ])
  })

  it("parses nan", () => {
    expect(nan("nan", 0)).toStrictEqual([
      true,
      { nan: null, isNegative: false },
      3
    ])
    expect(nan("-nan", 0)).toStrictEqual([
      true,
      { nan: null, isNegative: true },
      4
    ])
    expect(hexNan("-nan:0x200000", 0)).toStrictEqual([
      true,
      { nan: "0x200000", isNegative: true },
      13
    ])
  })

  it("parses inf", () => {
    expect(inf("inf", 0)).toStrictEqual([true, "+inf", 3])
    expect(inf("-inf", 0)).toStrictEqual([true, "-inf", 4])
  })

  it("parses hex", () => {
    expect(hexFloatNum("-0x1.921fb6p+2", 0)).toStrictEqual([
      true,
      {
        fraction: "-0x1.921fb6",
        exponent: "+2"
      },
      14
    ])
  })
})
