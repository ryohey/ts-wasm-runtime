import { Int32 } from "./Int32"

describe("Int32", () => {
  it("add", () => {
    const add = (a: string, b: string) =>
      Int32.add(Int32.hex(a), Int32.hex(b)).toString(16)

    expect(add("1", "1")).toBe("2")
    expect(add("1", "0")).toBe("1")
    expect(add("-1", "-1")).toBe("-2")
    expect(add("-1", "1")).toBe("0")
    expect(add("0x7fffffff", "1")).toBe("-80000000")
    expect(add("0x80000000", "-1")).toBe("7fffffff")
    expect(add("0x80000000", "0x80000000")).toBe("0")
    expect(add("0x3fffffff", "1")).toBe("40000000")
  })

  it("sub", () => {
    const sub = (a: string, b: string) =>
      Int32.sub(Int32.hex(a), Int32.hex(b)).toString(16)

    expect(sub("1", "1")).toBe("0")
    expect(sub("0", "1")).toBe("-1")
    expect(sub("-1", "-1")).toBe("0")
    expect(sub("-1", "0x7fffffff")).toBe("-80000000")
    expect(sub("0x80000000", "1")).toBe("7fffffff")
    expect(sub("0x80000000", "0x80000000")).toBe("0")
    expect(sub("0x3fffffff", "-1")).toBe("40000000")
  })

  it("mul", () => {
    const mul = (a: string, b: string) =>
      Int32.mul(Int32.hex(a), Int32.hex(b)).toString(16)

    expect(mul("1", "1")).toBe("1")
    expect(mul("0", "1")).toBe("0")
    expect(mul("-1", "-1")).toBe("1")
    expect(mul("0x1000", "0x10000000")).toBe("0")
    expect(mul("0", "0x80000000")).toBe("0")
    expect(mul("-1", "0x80000000")).toBe("-80000000")
    expect(mul("-1", "0x7fffffff")).toBe("-7fffffff")
    expect(mul("0x76543210", "0x01234567")).toBe("358e7470")
    expect(mul("0x7fffffff", "0x7fffffff")).toBe("1")
  })

  it("div_s", () => {
    const div = (a: string, b: string) =>
      Int32.div_s(Int32.hex(a), Int32.hex(b)).toString(16)

    expect(div("1", "1")).toBe("1")
    expect(div("2", "1")).toBe("2")
    expect(div("-1", "-1")).toBe("1")
    expect(div("0x1000", "0x10000000")).toBe("0")
  })
})
