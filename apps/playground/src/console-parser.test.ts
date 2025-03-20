import { parseConsoleInput } from "./console-parser"

describe("console-parser", () => {
  it("parseConsoleInput", () => {
    const r = parseConsoleInput("abc(1, 2, 3)", 0)
    expect(r).toStrictEqual([
      true,
      {
        type: "func-call",
        name: "abc",
        arguments: ["1", "2", "3"]
      },
      10
    ])
  })
})
