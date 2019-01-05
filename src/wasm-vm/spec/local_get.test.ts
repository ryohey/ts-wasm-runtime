import { runTests } from "../test-runner"

describe("local_get", () => {
  it("test", () => {
    runTests(
      `(module
        (func (export "type-local-i32") (result i32) (local i32) get_local 0)
        (func (export "type-local-i64") (result i64) (local i64) get_local 0)
        (func (export "type-local-f32") (result f32) (local f32) get_local 0)
        (func (export "type-local-f64") (result f64) (local f64) get_local 0)
        
        (func (export "type-param-i32") (param i32) (result i32) get_local 0)
        (func (export "type-param-i64") (param i64) (result i64) get_local 0)
        (func (export "type-param-f32") (param f32) (result f32) get_local 0)
        (func (export "type-param-f64") (param f64) (result f64) get_local 0)

        (func (export "type-mixed") (param i64 f32 f64 i32 i32)
          (local f32 i64 i64 f64)
          (drop (i64.eqz (local.get 0)))
          (drop (f32.neg (local.get 1)))
          (drop (f64.neg (local.get 2)))
          (drop (i32.eqz (local.get 3)))
          (drop (i32.eqz (local.get 4)))
          (drop (f32.neg (local.get 5)))
          (drop (i64.eqz (local.get 6)))
          (drop (i64.eqz (local.get 7)))
          (drop (f64.neg (local.get 8)))
        )
      )
      (assert_return (invoke "type-local-i32") (i32.const 0))
      (assert_return (invoke "type-local-i64") (i64.const 0))
      (assert_return (invoke "type-local-f32") (f32.const 0))
      (assert_return (invoke "type-local-f64") (f64.const 0))

      (assert_return (invoke "type-param-i32" (i32.const 2)) (i32.const 2))
      (assert_return (invoke "type-param-i64" (i64.const 3)) (i64.const 3))
      (assert_return (invoke "type-param-f32" (f32.const 4.4)) (f32.const 4.4))
      (assert_return (invoke "type-param-f64" (f64.const 5.5)) (f64.const 5.5))

      (assert_return
        (invoke "type-mixed"
          (i64.const 1) (f32.const 2.2) (f64.const 3.3) (i32.const 4) (i32.const 5)
        )
      )
      `
    )
  })
})
