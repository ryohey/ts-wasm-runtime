import { plainInstructions, attr } from "./operations"

describe("plainInstructions", () => {
  it("parses operator get_local with number", () => {
    const r = plainInstructions(["get_local", { int: "0" }], 0)
    expect(r).toStrictEqual([
      true,
      {
        opType: "get_local",
        parameter: 0
      },
      2
    ])
  })

  it("parses operator get_local with identifier", () => {
    const r = plainInstructions(["get_local", "$lhs"], 0)
    expect(r).toStrictEqual([
      true,
      {
        opType: "get_local",
        parameter: "$lhs"
      },
      2
    ])
  })
  it("parses attributes", () => {
    const r = attr("foo")(["foo=8"], 0)
    expect(r).toStrictEqual([true, 8, 1])
  })
  it("parses memory instructions", () => {
    const r = plainInstructions(["i32.load", "offset=8", "align=7"], 0)
    expect(r).toStrictEqual([
      true,
      {
        opType: "i32.load",
        offset: 8,
        align: 7
      },
      3
    ])
  })
})
