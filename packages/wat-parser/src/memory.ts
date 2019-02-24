import { map, seq, opt } from "@ryohey/fn-parser"
import { string, identifier, num } from "./types"
import { keyword, array } from "./utils"
import { WATMemory } from "./moduleTypes"

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
    } as WATMemory)
)
