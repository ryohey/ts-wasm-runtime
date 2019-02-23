import { plainInstructions } from "./operations"

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
})
