import * as assert from "assert"
import { countLeadingZeros, countTrailingZeros } from "./number"

describe("number", () => {
  it("countLeadingZeros", () => {
    assert.equal(countLeadingZeros(0b0000, 4), 4)
    assert.equal(countLeadingZeros(0b0010, 4), 2)
    assert.equal(countLeadingZeros(0b1000, 4), 0)
  })
  it("countTrailingZeros", () => {
    assert.equal(countTrailingZeros(0b0000, 4), 4)
    assert.equal(countTrailingZeros(0b0010, 4), 1)
    assert.equal(countTrailingZeros(0b0100, 4), 2)
    assert.equal(countTrailingZeros(0b1000, 4), 3)
  })
})
