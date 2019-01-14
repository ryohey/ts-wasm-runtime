import * as assert from "assert"
import { moduleTable } from "./table"

describe("table", () => {
  it("parses table", () => {
    const r = moduleTable(
      ["table", "$T0", { int: "1" }, { int: "1" }, "anyfunc"],
      0
    )
    assert.deepEqual(r, [
      true,
      { export: null, identifier: "$T0", nodeType: "table" },
      5
    ])
  })
})
