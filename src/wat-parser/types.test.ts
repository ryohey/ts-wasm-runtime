import * as assert from "assert"
import { string, identifier, name } from "./types"

describe("type parser", () => {
  it("string", () => {
    const r = string([`"foo bar"`], 0)
    assert.deepStrictEqual(r, [true, "foo bar", 1])
  })
  it("identifier", () => {
    const r = identifier(["$lhs"], 0)
    assert.deepStrictEqual(r, [true, "$lhs", 1])
  })
  it("name", () => {
    const r = name(["main"], 0)
    assert.deepStrictEqual(r, [true, "main", 1])
  })
})
