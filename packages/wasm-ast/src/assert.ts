import * as Op from "./instructions"

export interface ASTAssertReturn {
  nodeType: "assert_return"
  invoke: string
  args: Op.Const[]
  expected: Op.Const[]
}
