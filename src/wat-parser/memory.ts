import { map, seq, opt } from "../parser/parser"
import { ASTModuleNode, string, identifier } from "./types"
import { keyword, array, num } from "./utils"

export interface ASTMemory extends ASTModuleNode {
  nodeType: "memory"
  identifier: string | null
  export: string | null
}

export const moduleMemory = map(
  seq(
    keyword("memory"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    num
  ),
  r =>
    ({
      nodeType: "memory",
      identifier: r[1],
      export: r[2]
    } as ASTMemory)
)
