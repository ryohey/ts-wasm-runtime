import * as assert from "assert"
import { num, keyword, regexp } from "./utils"

describe("utils", () => {
  it("keyword", () => {
    const r = keyword("foo")(["foo"], 0)
    assert.deepEqual(r, [true, "foo", 1])
  })
  it("should not parse keyword", () => {
    const r = keyword("foo")(["bar"], 0)
    assert.equal(r[0], false),
    assert.equal(r[1], null)
  })
  it("number", () => {
    const r = num([3.14], 0)
    assert.deepEqual(r, [true, 3.14, 1])
  })
  it("regexp", () => {
    const r = regexp(/(.+foo.+)/)(["weefoowoo"], 0)
    assert.deepEqual(r, [true, "weefoowoo", 1])
  })
})
