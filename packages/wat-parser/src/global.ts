import { map, seq, or, opt } from "@ryohey/fn-parser"
import { WATGlobal } from "./moduleTypes"
import { string, identifier, valType } from "./types"
import { keyword, array } from "./utils"
import { initializerInstructions } from "./operations"

export const moduleGlobal = map(
  seq(
    keyword("global"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    or(
      map(valType, r => ({ mutable: false, type: r })),
      map(array(seq(keyword("mut"), valType)), r => ({
        mutable: true,
        type: r[1]
      }))
    ),
    array(initializerInstructions)
  ),
  r =>
    ({
      nodeType: "global",
      identifier: r[1],
      export: r[2],
      type: r[3].type,
      mutable: r[3].mutable,
      init: r[4]
    } as WATGlobal)
)
