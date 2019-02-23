import { string, identifier, name } from "./types"

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
})
