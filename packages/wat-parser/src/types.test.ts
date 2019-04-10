import {
  string,
  identifier,
  name,
  int32,
  int64,
  float32,
  float64
} from "./types"

describe("type parser", () => {
  it("string", () => {
    const r = string([`"foo bar"`], 0)
    expect(r).toStrictEqual([true, "foo bar", 1])
  })
  it("identifier", () => {
    const r = identifier(["$lhs"], 0)
    expect(r).toStrictEqual([true, "$lhs", 1])
  })
  it("name", () => {
    const r = name(["main"], 0)
    expect(r).toStrictEqual([true, "main", 1])
  })
  it("int32", () => {
    expect(int32(["123"], 0)).toStrictEqual([true, { i32: 123 }, 1])

    expect(int32(["0x456"], 0)).toStrictEqual([true, { i32: 0x456 }, 1])
  })
  it("int64", () => {
    expect(int64(["123"], 0)).toStrictEqual([true, { i64: 123n }, 1])

    expect(int64(["0x456"], 0)).toStrictEqual([true, { i64: 0x456n }, 1])
  })
  it("float32", () => {
    expect(float32(["123"], 0)).toStrictEqual([true, { f32: 123 }, 1])

    expect(float32(["0x456"], 0)).toStrictEqual([true, { f32: 0x456 }, 1])
  })
  it("float64", () => {
    expect(float64(["123"], 0)).toStrictEqual([true, { f64: 123 }, 1])

    expect(float64(["0x456"], 0)).toStrictEqual([true, { f64: 0x456 }, 1])
  })
})
