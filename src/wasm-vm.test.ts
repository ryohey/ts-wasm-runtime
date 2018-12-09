import * as assert from "assert"

describe("wasm-vm", () => {
  it("run", () => {
    assert(true)
  })
})
;`(module
    (func (export "add") (param i32) (param i32) (result i32)
      get_local 0 
      get_local 1
      i32.add
    )
  )`
