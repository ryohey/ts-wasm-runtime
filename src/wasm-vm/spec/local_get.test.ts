import { runTests } from "../test-runner"

describe("local_get", () => {
  it("test", () => {
    runTests(
      `(module
        (func (export "type-local-i32") (result i32) (local i32) get_local 0)
        (func (export "type-local-i64") (result i64) (local i64) get_local 0)
        (func (export "type-local-f32") (result f32) (local f32) get_local 0)
        (func (export "type-local-f64") (result f64) (local f64) get_local 0)
      )
      (assert_return (invoke "type-local-i32") (i32.const 0))
      (assert_return (invoke "type-local-i64") (i64.const 0))
      (assert_return (invoke "type-local-f32") (f32.const 0))
      (assert_return (invoke "type-local-f64") (f64.const 0))
      `
    )
  })
})
