import { runTests } from "../test-runner"

describe("local_get", () => {
  it("test", () => {
    runTests(
      `(module
        (func $fib (export "fib") (param $p0 i32) (result i32) (local $l0 i32)
          i32.const 1
          set_local $l0
          block $B0
            get_local $p0
            i32.const 2
            i32.lt_u
            br_if $B0
            i32.const 1
            set_local $l0
            loop $L1
              get_local $p0
              i32.const -1
              i32.add
              call $fib
              get_local $l0
              i32.add
              set_local $l0
              get_local $p0
              i32.const -2
              i32.add
              tee_local $p0
              i32.const 1
              i32.gt_u
              br_if $L1
            end
          end
          get_local $l0
        )
        (assert_return (invoke "fib" (i32.const 10)) (i32.const 89))
      )`
    )
  })
})
