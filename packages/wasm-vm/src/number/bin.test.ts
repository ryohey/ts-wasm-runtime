import * as assert from "assert"
import { countLeadingZeros, countTrailingZeros } from "./bin"

describe("number", () => {
  it("countLeadingZeros", () => {
    assert.equal(countLeadingZeros("0000", 4), 4)
    assert.equal(countLeadingZeros("0010", 4), 2)
    assert.equal(countLeadingZeros("1000", 4), 0)
  })
  it("countTrailingZeros", () => {
    assert.equal(countTrailingZeros("0000", 4), 4)
    assert.equal(countTrailingZeros("0010", 4), 1)
    assert.equal(countTrailingZeros("0100", 4), 2)
    assert.equal(countTrailingZeros("1000", 4), 3)
  })
})
