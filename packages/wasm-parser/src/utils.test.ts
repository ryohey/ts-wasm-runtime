import { variable, var1 } from "./utils"

describe("utils", () => {
  it("variable", () => {
    const input = [1, 2, 3]
    expect(variable(0)(input, 0)).toStrictEqual([true, [], 0])
    expect(variable(2)(input, 0)).toStrictEqual([true, [1, 2], 2])
    expect(variable(4)(input, 0)[0]).toStrictEqual(false)
    expect(variable(2)(input, 1)).toStrictEqual([true, [2, 3], 3])
  })
  it("var1", () => {
    const input = [1, 2, 3]
    expect(var1(input, 1)).toStrictEqual([true, 2, 2])
  })
})
