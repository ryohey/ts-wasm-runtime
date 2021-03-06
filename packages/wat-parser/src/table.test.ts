import { moduleTable } from "./table"

describe("table", () => {
  it("parses table", () => {
    const r = moduleTable(["table", "$T0", "1", "1", "anyfunc"], 0)
    expect(r).toStrictEqual([
      true,
      { export: null, identifier: "$T0", nodeType: "table" },
      5
    ])
  })
})
