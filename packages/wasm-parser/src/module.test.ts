import * as fs from "fs"
import { moduleParser, elemSection, exportSection } from "./module"

describe("module", () => {
  it("parses file", () => {
    const wasm = Array.from(fs.readFileSync("./fixtures/main.wasm"))
    const r = moduleParser(wasm, 0)
    expect(r).toStrictEqual([
      true,
      [
        { version: 1 },
        [
          {
            id: 1,
            nodeType: "type",
            sections: [
              { parameters: ["i32", "i32"], results: ["i32"] },
              { parameters: ["i32"], results: [] },
              { parameters: [], results: [] }
            ],
            size: 14
          }
        ],
        [
          {
            id: 2,
            nodeType: "import",
            sections: [{ desc: { func: 1 }, module: "console", name: "log" }],
            size: 15
          }
        ],
        [{ id: 3, nodeType: "func", sections: [0, 2], size: 3 }],
        [
          {
            id: 5,
            nodeType: "mem",
            sections: [{ type: { lim: { max: 2, min: 128 } } }],
            size: 6
          }
        ],
        [
          {
            id: 6,
            nodeType: "global",
            sections: [
              {
                init: [{ opType: "i32.const", parameter: { i32: "0x0" } }],
                type: ["i32", "var"]
              }
            ],
            size: 6
          }
        ],
        [
          {
            id: 7,
            nodeType: "export",
            sections: [{ desc: { func: 1 }, name: "add" }],
            size: 7
          }
        ],
        [
          {
            id: 8,
            nodeType: "start",
            sections: [{ func: 0 }, { func: 0 }],
            size: 1
          }
        ],
        [
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
          }
        ],
        [
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
          }
        ],
        [{ id: 0, nodeType: "custom", sections: [], size: 45 }]
      ],
      159
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
    expect(r).toStrictEqual([
      true,
      {
        id: 9,
        nodeType: "elem",
        sections: [
          {
            init: [2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2],
            offset: [{ opType: "i32.const", parameter: { i32: "0x0" } }],
            table: 0
          }
        ],
        size: 22
      },
      24
    ])
  })

  it("parses export", () => {
    const input = [
      0x07,
      0xcf,
      0x01,
      0x0c,
      0x04,
      0x74,
      0x69,
      0x63,
      0x6b,
      0x00,
      0x0e,
      0x15,
      0x70,
      0x72,
      0x6f,
      0x6d,
      0x6f,
      0x74,
      0x65,
      0x4e,
      0x65,
      0x78,
      0x74,
      0x47,
      0x65,
      0x6e,
      0x65,
      0x72,
      0x61,
      0x74,
      0x69,
      0x6f,
      0x6e,
      0x00,
      0x0d,
      0x0e,
      0x65,
      0x76,
      0x6f,
      0x6c,
      0x76,
      0x65,
      0x41,
      0x6c,
      0x6c,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x73,
      0x00,
      0x0c,
      0x1a,
      0x65,
      0x76,
      0x6f,
      0x6c,
      0x76,
      0x65,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x54,
      0x6f,
      0x4e,
      0x65,
      0x78,
      0x74,
      0x47,
      0x65,
      0x6e,
      0x65,
      0x72,
      0x61,
      0x74,
      0x69,
      0x6f,
      0x6e,
      0x00,
      0x0a,
      0x1d,
      0x73,
      0x65,
      0x74,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x53,
      0x74,
      0x61,
      0x74,
      0x65,
      0x46,
      0x6f,
      0x72,
      0x4e,
      0x65,
      0x78,
      0x74,
      0x47,
      0x65,
      0x6e,
      0x65,
      0x72,
      0x61,
      0x74,
      0x69,
      0x6f,
      0x6e,
      0x00,
      0x09,
      0x0b,
      0x69,
      0x73,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x41,
      0x6c,
      0x69,
      0x76,
      0x65,
      0x00,
      0x08,
      0x07,
      0x69,
      0x6e,
      0x52,
      0x61,
      0x6e,
      0x67,
      0x65,
      0x00,
      0x07,
      0x14,
      0x6f,
      0x66,
      0x66,
      0x73,
      0x65,
      0x74,
      0x46,
      0x72,
      0x6f,
      0x6d,
      0x43,
      0x6f,
      0x6f,
      0x72,
      0x64,
      0x69,
      0x6e,
      0x61,
      0x74,
      0x65,
      0x00,
      0x03,
      0x12,
      0x6c,
      0x69,
      0x76,
      0x65,
      0x4e,
      0x65,
      0x69,
      0x67,
      0x68,
      0x62,
      0x6f,
      0x75,
      0x72,
      0x43,
      0x6f,
      0x75,
      0x6e,
      0x74,
      0x00,
      0x06,
      0x07,
      0x67,
      0x65,
      0x74,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x00,
      0x05,
      0x07,
      0x73,
      0x65,
      0x74,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x00,
      0x04,
      0x06,
      0x6d,
      0x65,
      0x6d,
      0x6f,
      0x72,
      0x79,
      0x02,
      0x00
    ]
    const r = exportSection(input, 0)
    expect(r).toStrictEqual([
      true,
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
        size: 207
      },
      210
    ])
  })
})
