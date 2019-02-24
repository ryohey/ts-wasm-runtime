import { map, seq, opt } from "@ryohey/fn-parser"
import { WATType } from "./moduleTypes"
import { identifier, blockType } from "./types"
import { keyword, array } from "./utils"

const funcDef = seq(keyword("func"), opt(blockType))

export const moduleType = map(
  seq(keyword("type"), opt(identifier), array(funcDef)),
  r =>
    ({
      nodeType: "type",
      identifier: r[1]
    } as WATType)
)
