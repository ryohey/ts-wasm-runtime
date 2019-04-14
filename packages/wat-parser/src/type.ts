import { map, seq, opt, many } from "@ryohey/fn-parser"
import { WATType } from "./moduleTypes"
import { identifier, blockType } from "./types"
import { keyword, array } from "./utils"
import { param } from "./func"

const funcDef = map(
  seq(keyword("func"), opt(array(param)), opt(array(blockType))),
  r => ({
    parameters: r[1] || [],
    results: r[2] !== null ? [r[2]] : []
  })
)

export const moduleType = map(
  seq(keyword("type"), opt(identifier), array(funcDef)),
  r =>
    ({
      nodeType: "type",
      identifier: r[1],
      ...r[2]
    } as WATType)
)
