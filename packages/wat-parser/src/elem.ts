import { map, seq, many } from "@ryohey/fn-parser"
import { identifier } from "./types"
import { keyword, array } from "./utils"
import { constInstructions } from "./operations"
import { WATElem } from "./moduleTypes"

export const moduleElem = map(
  seq(keyword("elem"), array(constInstructions), many(identifier)),
  r =>
    ({
      nodeType: "elem",
      offset: r[1].parameter,
      funcIds: r[2]
    } as WATElem)
)
