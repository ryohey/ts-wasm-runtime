(module
  (func $dummy)

  (func (export "select_i32") (param $lhs i32) (param $rhs i32) (param $cond i32) (result i32)
   (select (local.get $lhs) (local.get $rhs) (local.get $cond)))

  (func (export "select_i64") (param $lhs i64) (param $rhs i64) (param $cond i32) (result i64)
   (select (local.get $lhs) (local.get $rhs) (local.get $cond)))
)
(assert_return (invoke "select_i32" (i32.const 1) (i32.const 2) (i32.const 1)) (i32.const 1))
(assert_return (invoke "select_i64" (i64.const 2) (i64.const 1) (i32.const 1)) (i64.const 2))

(assert_return (invoke "select_i32" (i32.const 1) (i32.const 2) (i32.const 0)) (i32.const 2))
(assert_return (invoke "select_i32" (i32.const 2) (i32.const 1) (i32.const 0)) (i32.const 1))
(assert_return (invoke "select_i64" (i64.const 2) (i64.const 1) (i32.const -1)) (i64.const 2))
(assert_return (invoke "select_i64" (i64.const 2) (i64.const 1) (i32.const 0xf0f0f0f0)) (i64.const 2))
