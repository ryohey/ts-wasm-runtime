import * as assert from "assert"
import { variable, var1 } from "./utils"

describe("utils", () => {
  it("variable", () => {
    const input = [1, 2, 3]
    assert.deepStrictEqual(variable(0)(input, 0), [true, [], 0])
    assert.deepStrictEqual(variable(2)(input, 0), [true, [1, 2], 2])
    assert.strictEqual(variable(4)(input, 0)[0], false)
    assert.deepStrictEqual(variable(2)(input, 1), [true, [2, 3], 3])
  })
  it("var1", () => {
    const input = [1, 2, 3]
    assert.deepStrictEqual(var1(input, 1), [true, 2, 2])
  })
})
