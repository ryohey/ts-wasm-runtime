import { parser as sParser } from "@ryohey/s-parser"
import { moduleParser } from "./module"

describe("module parser", () => {
  it("parses module", () => {
    const r = moduleParser(
      [
        "module",
        [
          "func",
          ["export", `"add"`],
          ["param", "i32"],
          ["param", "i32"],
          ["result", "i32"],
          "get_local",
          "0",
          "get_local",
          "1",
          "i32.add"
        ]
      ],
      0
    )
    expect(r).toStrictEqual([
      true,
      {
        nodeType: "module",
        exports: [],
        globals: [],
        memories: [],
        tables: [],
        types: [],
        elems: [],
        functions: [
          {
            nodeType: "func",
            identifier: null,
            export: "add",
            parameters: [
              {
                identifier: null,
                type: "i32"
              },
              {
                identifier: null,
                type: "i32"
              }
            ],
            results: ["i32"],
            locals: [],
            body: [
              {
                opType: "get_local",
                parameter: 0
              },
              {
                opType: "get_local",
                parameter: 1
              },
              {
                opType: "i32.add"
              }
            ]
          }
        ]
      },
      2
    ])
  })
  it("parses modules from string", () => {
    const sExp = sParser(
      `(module 
        (func (export "add") (param i32) (param i32) (result i32)
          get_local 0 
          get_local 1
          i32.add
        )
      )`,
      0
    )

    const r = moduleParser(sExp[1], 0)

    expect(r).toStrictEqual([
      true,
      {
        nodeType: "module",
        exports: [],
        globals: [],
        memories: [],
        tables: [],
        types: [],
        elems: [],
        functions: [
          {
            nodeType: "func",
            identifier: null,
            export: "add",
            parameters: [
              {
                identifier: null,
                type: "i32"
              },
              {
                identifier: null,
                type: "i32"
              }
            ],
            results: ["i32"],
            locals: [],
            body: [
              {
                opType: "get_local",
                parameter: 0
              },
              {
                opType: "get_local",
                parameter: 1
              },
              {
                opType: "i32.add"
              }
            ]
          }
        ]
      },
      2
    ])
  })
  it("parses global, memory, tables", () => {
    const sExp = sParser(
      `(module
        (type $t0 (func))
        (type $t1 (func (result i32)))
        (func $__wasm_call_ctors (type $t0))
        (func $main (export "main") (type $t1) (result i32)
          i32.const 42)
        (table $T0 1 1 anyfunc)
        (memory $memory (export "memory") 2)
        (global $g0 (mut i32) (i32.const 66560))
        (global $__heap_base (export "__heap_base") i32 (i32.const 66560))
        (global $__data_end (export "__data_end") i32 (i32.const 1024))
      )`,
      0
    )
    const r = moduleParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      {
        exports: [],
        elems: [],
        functions: [
          {
            body: [],
            export: null,
            identifier: "$__wasm_call_ctors",
            locals: [],
            nodeType: "func",
            parameters: [],
            results: []
          },
          {
            body: [],
            export: "main",
            identifier: "$main",
            locals: [],
            nodeType: "func",
            parameters: [],
            results: []
          }
        ],
        globals: [
          {
            export: null,
            identifier: "$g0",
            mutable: true,
            nodeType: "global",
            init: { opType: "i32.const", parameter: { i32: 66560 } },
            type: "i32"
          },
          {
            export: "__heap_base",
            identifier: "$__heap_base",
            mutable: false,
            nodeType: "global",
            init: { opType: "i32.const", parameter: { i32: 66560 } },
            type: "i32"
          },
          {
            export: "__data_end",
            identifier: "$__data_end",
            init: { opType: "i32.const", parameter: { i32: 1024 } },
            mutable: false,
            nodeType: "global",
            type: "i32"
          }
        ],
        memories: [
          { export: "memory", identifier: "$memory", nodeType: "memory" }
        ],
        nodeType: "module",
        tables: [{ export: null, identifier: "$T0", nodeType: "table" }],
        types: [
          { identifier: "$t0", nodeType: "type" },
          { identifier: "$t1", nodeType: "type" }
        ]
      },
      10
    ])
  })
})
