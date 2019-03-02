import { map, seq, many } from "@ryohey/fn-parser"
import { identifier } from "./types"
import { keyword, array } from "./utils"
import { initializerInstructions } from "./operations"
import { WATElem } from "./moduleTypes"

export const moduleElem = map(
  seq(keyword("elem"), array(initializerInstructions), many(identifier)),
  r =>
    ({
      nodeType: "elem",
      offset: r[1],
      funcIds: r[2]
    } as WATElem)
)
