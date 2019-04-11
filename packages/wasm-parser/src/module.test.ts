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
        types: [
          { parameters: ["i32", "i32"], results: ["i32"] },
          { parameters: ["i32"], results: [] },
          { parameters: [], results: [] }
        ],
        imports: [{ desc: { func: 1 }, module: "console", name: "log" }],
        funcs: [0, 2],
        mems: [{ max: 2, min: 128 }],
        globals: [
          {
            init: { opType: "i32.const", parameter: { i32: 0x0 } },
            type: { type: "i32", isMutable: true }
          }
        ],
        exports: [{ desc: { func: 1 }, name: "add" }],
        starts: [{ func: 0 }, { func: 0 }],
        codes: [
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
              { opType: "i32.const", parameter: { i32: 0x2a } },
              { opType: "call", parameter: 0 }
            ],
            locals: [],
            size: 6
          }
        ],
        data: [
          {
            data: 0,
            init: [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100],
            offset: { opType: "i32.const", parameter: { i32: 0x08 } }
          }
        ],
        elems: [],
        tables: []
      },
      159
    ])
  })
})
