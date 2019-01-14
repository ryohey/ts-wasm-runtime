import * as assert from "assert"
import { Int32 } from "./Int32"

describe("Int32", () => {
  it("add", () => {
    const add = (a: string, b: string) =>
      Int32.add(Int32.hex(a), Int32.hex(b)).toString(16)

    assert.equal(add("1", "1"), "2")
    assert.equal(add("1", "0"), "1")
    assert.equal(add("-1", "-1"), "-2")
    assert.equal(add("-1", "1"), "0")
    assert.equal(add("0x7fffffff", "1"), "-80000000")
    assert.equal(add("0x80000000", "-1"), "7fffffff")
    assert.equal(add("0x80000000", "0x80000000"), "0")
    assert.equal(add("0x3fffffff", "1"), "40000000")
  })

  it("sub", () => {
    const sub = (a: string, b: string) =>
      Int32.sub(Int32.hex(a), Int32.hex(b)).toString(16)

    assert.equal(sub("1", "1"), "0")
    assert.equal(sub("0", "1"), "-1")
    assert.equal(sub("-1", "-1"), "0")
    assert.equal(sub("-1", "0x7fffffff"), "-80000000")
    assert.equal(sub("0x80000000", "1"), "7fffffff")
    assert.equal(sub("0x80000000", "0x80000000"), "0")
    assert.equal(sub("0x3fffffff", "-1"), "40000000")
  })

  it("mul", () => {
    const mul = (a: string, b: string) =>
      Int32.mul(Int32.hex(a), Int32.hex(b)).toString(16)

    assert.equal(mul("1", "1"), "1")
    assert.equal(mul("0", "1"), "0")
    assert.equal(mul("-1", "-1"), "1")
    assert.equal(mul("0x1000", "0x10000000"), "0")
    assert.equal(mul("0", "0x80000000"), "0")
    assert.equal(mul("-1", "0x80000000"), "-80000000")
    assert.equal(mul("-1", "0x7fffffff"), "-7fffffff")
    assert.equal(mul("0x76543210", "0x01234567"), "358e7470")
    assert.equal(mul("0x7fffffff", "0x7fffffff"), "1")
  })
})
