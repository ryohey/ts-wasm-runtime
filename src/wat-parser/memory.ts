import { map, seq, opt } from "../parser/parser"
import { string, identifier, num } from "./types"
import { keyword, array } from "./utils"
import { ASTMemory } from "../ast/module"

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
