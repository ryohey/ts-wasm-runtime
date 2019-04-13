import { parser as sParser } from "@ryohey/s-parser"
import { ifParser } from "./if"

describe("if", () => {
  it("parses if-then-else", () => {
    const sExp = sParser(`(if nop else nop end)`, 0)
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "text.if",
          identifier: null,
          results: [],
          then: [{ opType: "nop" }],
          else: [{ opType: "nop" }]
        }
      ],
      5
    ])
  })
  it("parses if-then-else block", () => {
    const sExp = sParser(
      `((if (result i32)
      (then
        i32.const 10)
      (else
        i32.const 3)
      ))`,
      0
    )
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "text.if",
          identifier: null,
          results: ["i32"],
          then: [{ opType: "i32.const", parameter: { i32: 10 } }],
          else: [{ opType: "i32.const", parameter: { i32: 3 } }]
        }
      ],
      1
    ])
  })

  it("parses if-then", () => {
    const sExp = sParser(`(if nop end)`, 0)
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "text.if",
          identifier: null,
          results: [],
          then: [{ opType: "nop" }],
          else: []
        }
      ],
      3
    ])
  })

  it("parses if-then block", () => {
    const sExp = sParser(`((if $foo (then i32.const 10)))`, 0)
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        {
          opType: "text.if",
          identifier: "$foo",
          results: [],
          then: [{ opType: "i32.const", parameter: { i32: 10 } }],
          else: []
        }
      ],
      1
    ])
  })

  it("parses folded if-then block", () => {
    const sExp = sParser(`((if (local.get 0) (then (nop))))`, 0)
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        { opType: "local.get", parameter: 0 },
        {
          opType: "text.if",
          identifier: null,
          then: [{ opType: "nop" }],
          else: [],
          results: []
        }
      ],
      1
    ])
  })

  it("parses folded if-then-else block", () => {
    const sExp = sParser(`((if (local.get 0) (then (nop)) (else (nop))))`, 0)
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        { opType: "local.get", parameter: 0 },
        {
          opType: "text.if",
          identifier: null,
          then: [{ opType: "nop" }],
          else: [{ opType: "nop" }],
          results: []
        }
      ],
      1
    ])
  })

  it("parses folded if-then-else block with result", () => {
    const sExp = sParser(
      `((if (result i32) (local.get 0) (then (i32.const 7)) (else (i32.const 8))))`,
      0
    )
    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        { opType: "local.get", parameter: 0 },
        {
          opType: "text.if",
          identifier: null,
          then: [{ opType: "i32.const", parameter: { i32: 7 } }],
          else: [{ opType: "i32.const", parameter: { i32: 8 } }],
          results: ["i32"]
        }
      ],
      1
    ])
  })

  it("parses as-if-condition", () => {
    const sExp = sParser(
      `((if (result i32)
        (if (result i32) (local.get 0)
          (then (i32.const 1)) (else (i32.const 0))
        )
        (then (call $dummy) (i32.const 2))
        (else (call $dummy) (i32.const 3))
      ))`,
      0
    )

    const r = ifParser(sExp[1], 0)
    expect(r).toStrictEqual([
      true,
      [
        { opType: "local.get", parameter: 0 },
        {
          opType: "text.if",
          identifier: null,
          then: [{ opType: "i32.const", parameter: { i32: 1 } }],
          else: [{ opType: "i32.const", parameter: { i32: 0 } }],
          results: ["i32"]
        },
        {
          opType: "text.if",
          identifier: null,
          then: [
            { opType: "text.call", parameter: "$dummy" },
            { opType: "i32.const", parameter: { i32: 2 } }
          ],
          else: [
            { opType: "text.call", parameter: "$dummy" },
            { opType: "i32.const", parameter: { i32: 3 } }
          ],
          results: ["i32"]
        }
      ],
      1
    ])
  })
})
