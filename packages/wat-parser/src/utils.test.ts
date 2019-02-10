import * as assert from "assert"
import { keyword, regexp } from "./utils"

describe("utils", () => {
  it("keyword", () => {
    const r = keyword("foo")(["foo"], 0)
    assert.deepEqual(r, [true, "foo", 1])
  })
  it("should not parse keyword", () => {
    const r = keyword("foo")(["bar"], 0)
    assert.equal(r[0], false)
    assert.equal(r[1], null)
  })
  it("regexp", () => {
    const r = regexp(/(.+foo.+)/)(["weefoowoo"], 0)
    assert.deepEqual(r, [true, "weefoowoo", 1])
  })
})
