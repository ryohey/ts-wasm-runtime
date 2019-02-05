import * as assert from "assert"
import * as fs from "fs"
import { moduleParser, uLEB128Bytes, u32, elemSection } from "./module"

describe("module", () => {
  it("uLEB128", () => {
    const r = uLEB128Bytes([0b1000_1100, 0b0000_0001, 0b0001_0000], 0)
    assert.deepStrictEqual(r, [true, [12, 1], 2])
  })

  it("uLEB128", () => {
    const r = uLEB128Bytes([0b1000_1100, 0b1000_0001, 0b0001_0000], 0)
    assert.deepStrictEqual(r, [true, [12, 1, 16], 3])
  })

  it("u32", () => {
    const r = u32([0b1000_0001, 0b0000_0001], 0)
    assert.deepStrictEqual(r, [true, 129, 2])
  })

  it("parses file", () => {
    const wasm = Array.from(fs.readFileSync("./src/wasm-parser/main.wasm"))
    const r = moduleParser(wasm, 0)
    assert.deepStrictEqual(r, [
      true,
      [
        [
          {
            id: 1,
            nodeType: "type",
            sections: [
              { parameters: ["i32", "i32"], results: [] },
              { parameters: [], results: ["i32"] },
              { parameters: ["i32", "i32"], results: ["i32"] },
              { parameters: ["i32", "i32", "i32"], results: [] },
              { parameters: ["i32", "i32", "i32"], results: ["i32"] },
              { parameters: ["i32"], results: ["i32"] },
              { parameters: [], results: [] }
            ],
            size: 37
          }
        ],
        [
          {
            id: 2,
            nodeType: "import",
            sections: [{ desc: { func: 0 }, module: "console", name: "log" }],
            size: 15
          }
        ],
        [
          {
            id: 3,
            nodeType: "func",
            sections: [1, 1, 2, 3, 2, 2, 4, 2, 3, 0, 5, 6, 6, 6],
            size: 15
          }
        ],
        [
          {
            id: 4,
            nodeType: "table",
            sections: [{ type: { funcref: 112, lim: { min: 16 } } }],
            size: 4
          }
        ],
        [
          {
            id: 5,
            nodeType: "mem",
            sections: [{ type: { lim: { min: 1 } } }],
            size: 3
          }
        ],
        [
          {
            id: 7,
            nodeType: "export",
            sections: [
              { desc: { func: 14 }, name: "tick" },
              { desc: { func: 13 }, name: "promoteNextGeneration" },
              { desc: { func: 12 }, name: "evolveAllCells" },
              { desc: { func: 10 }, name: "evolveCellToNextGeneration" },
              { desc: { func: 9 }, name: "setCellStateForNextGeneration" },
              { desc: { func: 8 }, name: "isCellAlive" },
              { desc: { func: 7 }, name: "inRange" },
              { desc: { func: 3 }, name: "offsetFromCoordinate" },
              { desc: { func: 6 }, name: "liveNeighbourCount" },
              { desc: { func: 5 }, name: "getCell" },
              { desc: { func: 4 }, name: "setCell" },
              { desc: { mem: 0 }, name: "memory" }
            ],
            size: 10113
          }
        ]
      ],
      10208
    ])
  })

  it("parses elem", () => {
    const wasm = [
      9,
      22,
      1,
      0,
      65,
      0,
      11,
      16,
      2,
      2,
      2,
      1,
      2,
      2,
      2,
      2,
      2,
      2,
      1,
      1,
      2,
      2,
      2,
      2,
      10,
      140,
      3
    ]
    const r = elemSection(wasm, 0)
    assert.deepStrictEqual(r, [])
  })
})
