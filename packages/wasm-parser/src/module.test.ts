import * as fs from "fs"
import { moduleParser } from "./module"

describe("module", () => {
  it("parses file", () => {
    const wasm = Array.from(fs.readFileSync("./fixtures/main.wasm"))
    const r = moduleParser(wasm, 0)
    expect(r).toStrictEqual([
      true,
      {
        version: 1,
        sections: [
          {
            id: 1,
            nodeType: "type",
            sections: [
              { parameters: ["i32", "i32"], results: ["i32"] },
              { parameters: ["i32"], results: [] },
              { parameters: [], results: [] }
            ],
            size: 14
          },
          {
            id: 2,
            nodeType: "import",
            sections: [{ desc: { func: 1 }, module: "console", name: "log" }],
            size: 15
          },
          { id: 3, nodeType: "func", sections: [0, 2], size: 3 },

          {
            id: 5,
            nodeType: "mem",
            sections: [{ max: 2, min: 128 }],
            size: 6
          },
          {
            id: 6,
            nodeType: "global",
            sections: [
              {
                init: [{ opType: "i32.const", parameter: { i32: "0x0" } }],
                type: { type: "i32", isMutable: true }
              }
            ],
            size: 6
          },
          {
            id: 7,
            nodeType: "export",
            sections: [{ desc: { func: 1 }, name: "add" }],
            size: 7
          },
          {
            id: 8,
            nodeType: "start",
            sections: [{ func: 0 }, { func: 0 }],
            size: 1
          },
          {
            id: 10,
            nodeType: "code",
            sections: [
              {
                body: [
                  { opType: "local.get", parameter: 0 },
                  { opType: "local.get", parameter: 1 },
                  { opType: "i32.add" }
                ],
                locals: [],
                size: 7
              },
              {
                body: [
                  { opType: "i32.const", parameter: { i32: "0x2a" } },
                  { opType: "call", parameter: 0 }
                ],
                locals: [],
                size: 6
              }
            ],
            size: 16
          },
          {
            id: 11,
            nodeType: "data",
            sections: [
              {
                data: 0,
                init: [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100],
                offset: [{ opType: "i32.const", parameter: { i32: "0x08" } }]
              }
            ],
            size: 18
          },
          { id: 0, nodeType: "custom", sections: [], size: 45 }
        ]
      },
      159
    ])
  })
})
