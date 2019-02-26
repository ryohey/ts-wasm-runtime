import { elemSection } from "./elem"

describe("elem", () => {
  it("parses section", () => {
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
})
