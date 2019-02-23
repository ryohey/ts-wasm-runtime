import { keyword, regexp } from "./utils"

describe("utils", () => {
  it("keyword", () => {
    const r = keyword("foo")(["foo"], 0)
    expect(r).toStrictEqual([true, "foo", 1])
  })
  it("should not parse keyword", () => {
    const r = keyword("foo")(["bar"], 0)
    expect(r[0]).toBeFalsy
    expect(r[1]).toBeTruthy
  })
  it("regexp", () => {
    const r = regexp(/(.+foo.+)/)(["weefoowoo"], 0)
    expect(r).toStrictEqual([true, "weefoowoo", 1])
  })
})
