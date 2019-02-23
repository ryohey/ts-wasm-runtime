import { float } from "./float"

describe("float", () => {
  it("parses", () => {
    expect(float("-0x0p+0", 0)).toStrictEqual([
      true,
      { type: "number", e: "+0", p: "-0x0", isHex: true },
      7
    ])
  })

  it("parses nan", () => {
    expect(float("nan", 0)).toStrictEqual([
      true,
      { type: "nan", isNegative: false },
      3
    ])
    expect(float("-nan", 0)).toStrictEqual([
      true,
      { type: "nan", isNegative: true },
      4
    ])
    expect(float("-nan:0x200000", 0)).toStrictEqual([
      true,
      { type: "nan", isNegative: true, payload: "0x200000", isHex: true },
      13
    ])
  })

  it("parses inf", () => {
    expect(float("inf", 0)).toStrictEqual([
      true,
      { type: "inf", isNegative: false },
      3
    ])
    expect(float("-inf", 0)).toStrictEqual([
      true,
      { type: "inf", isNegative: true },
      4
    ])
  })

  it("parses hex", () => {
    expect(float("-0x1.921fb6p+2", 0)).toStrictEqual([
      true,
      {
        type: "number",
        p: "-0x1.921fb6",
        e: "+2",
        isHex: true
      },
      14
    ])
  })
})
