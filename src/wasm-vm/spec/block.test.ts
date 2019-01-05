import { runTests } from "../test-runner"

describe("block", () => {
  it("test", () => {
    runTests(
      `(module
        (func $dummy)
        (func (export "empty")
          block
          (i32.const 42)
          end
        )
        (func (export "singular") (result i32)
          (block (nop))
          (block (result i32) (i32.const 7))
        )
        (func (export "multi") (result i32)
          (block (call $dummy) (call $dummy) (call $dummy) (call $dummy))
          (block (result i32) (call $dummy) (call $dummy) (call $dummy) (i32.const 8))
        )
        (func (export "nested") (result i32)
          (block (result i32)
            (block (call $dummy) (block) (nop))
            (block (result i32) (call $dummy) (i32.const 9))
          )
        )
      )
      (assert_return (invoke "empty"))
      (assert_return (invoke "singular") (i32.const 7))
      (assert_return (invoke "multi") (i32.const 8))
      (assert_return (invoke "nested") (i32.const 9))
      `
    )
  })
})
