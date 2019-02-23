import { flatten, range } from "./index"

describe("array-helper", () => {
  it("flatten", () => {
    expect(flatten([[1], [2], [3, 4]])).toStrictEqual([1, 2, 3, 4])
  })
  it("range", () => {
    expect(range(0, 2)).toStrictEqual([0, 1])
    expect(range(0, 0)).toStrictEqual([])
  })
})
