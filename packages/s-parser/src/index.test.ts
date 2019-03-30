import { parser, multiParser, expression } from "./index"

describe("parser", () => {
  it("parse text", () => {
    const r = expression("abc", 0)
    expect(r).toStrictEqual([true, "abc", 3])
  })

  it("parse number", () => {
    const r = expression("123", 0)
    expect(r).toStrictEqual([true, { int: "123" }, 3])
  })

  it("parse float number", () => {
    const r = expression("123.456", 0)
    expect(r).toStrictEqual([true, { float: "123.456" }, 7])
  })

  it("parse hex number", () => {
    const r = expression("0x123F", 0)
    expect(r).toStrictEqual([true, { hex: "0x123F" }, 6])
  })

  it("parse list with single token", () => {
    const r = parser("(a)", 0)
    expect(r).toStrictEqual([true, ["a"], 3])
  })

  it("parse list", () => {
    const r = parser("(a b c)", 0)
    expect(r).toStrictEqual([true, ["a", "b", "c"], 7])
  })

  it("parse nested list", () => {
    const r = parser("(a (b c) ((d)))", 0)
    expect(r).toStrictEqual([true, ["a", ["b", "c"], [["d"]]], 15])
  })

  it("parse multiline text", () => {
    const r = parser(
      `(a
      (b c)
      )`,
      0
    )
    expect(r).toStrictEqual([true, ["a", ["b", "c"]], 22])
  })

  it("parse wasm", () => {
    const r = parser(
      `(func (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add)`,
      0
    )
    expect(r).toStrictEqual([
      true,
      [
        "func",
        ["param", "$lhs", "i32"],
        ["param", "$rhs", "i32"],
        ["result", "i32"],
        "get_local",
        "$lhs",
        "get_local",
        "$rhs",
        "i32.add"
      ],
      103
    ])
  })

  it("parses wasm2", () => {
    const r = parser(
      `(module 
      (func (export "hello") (result i32)
        i32.const 42
      )
    )`,
      0
    )
    expect(r).toStrictEqual([
      true,
      [
        "module",
        [
          "func",
          ["export", '"hello"'],
          ["result", "i32"],
          "i32.const",
          { int: "42" }
        ]
      ],
      85
    ])
  })

  it("parses multiple list", () => {
    const r = multiParser(
      `(aa bb)
      (c d)
      `,
      0
    )
    expect(r).toStrictEqual([true, [["aa", "bb"], ["c", "d"]], 26])
  })

  it("parses with comments", () => {
    const r = parser(
      `;; comment
         (a (b ;;yes (x y)
          c))
      `,
      0
    )
    expect(r).toStrictEqual([true, ["a", ["b", "c"]], 51])
  })

  it("parses i32.load", () => {
    const r = parser(`(i32.load offset=123 align=456)`, 0)
    expect(r).toStrictEqual([true, ["i32.load", "offset=123", "align=456"], 31])
  })
})
