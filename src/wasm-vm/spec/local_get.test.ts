import { runTests } from "../test-runner"

describe("local_get", () => {
  it("test", () => {
    runTests(
      `(module
        (func (export "type-local-i32") (result i32) (local i32)
            get_local 0
        )
      )
      (assert_return (invoke "type-local-i32") (i32.const 0))
      `
    )
  })
})
