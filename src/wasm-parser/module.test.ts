import * as assert from "assert"
import * as fs from "fs"
import { moduleParser } from "./module"

describe("module", () => {
  it("parses file", () => {
    const wasm = Array.from(fs.readFileSync("./src/wasm-parser/main.wasm"))
    const r = moduleParser(wasm, 0)
    assert.deepStrictEqual(r, [
      true,
      [
        { version: 1 },
        [
          {
            body: [
              true,
              [
                { nodeType: "type", parameters: ["i32", "i32"], results: [] },
                { nodeType: "type", parameters: [], results: ["i32"] },
                {
                  nodeType: "type",
                  parameters: ["i32", "i32"],
                  results: ["i32"]
                },
                {
                  nodeType: "type",
                  parameters: ["i32", "i32", "i32"],
                  results: []
                },
                {
                  nodeType: "type",
                  parameters: ["i32", "i32", "i32"],
                  results: ["i32"]
                },
                { nodeType: "type", parameters: ["i32"], results: ["i32"] },
                { nodeType: "type", parameters: [], results: [] }
              ],
              37
            ],
            id: 1,
            size: 37
          }
        ],
        [
          {
            body: [
              true,
              [{ desc: { func: 0 }, module: "console", name: "log" }],
              15
            ],
            id: 2,
            size: 15
          }
        ],
        [{ body: null, id: 3, size: 15 }],
        [
          {
            body: [true, [{ type: { funcref: 112, lim: { min: 16 } } }], 4],
            id: 4,
            size: 4
          }
        ],
        [{ body: null, id: 5, size: 3 }],
        [{ body: null, id: 7, size: 207 }],
        [{ body: null, id: 0, size: 9 }]
      ],
      312
    ])
  })
})
