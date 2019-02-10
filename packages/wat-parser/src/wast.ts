import { or, many, transform } from "@ryohey/fn-parser"
import { multiParser } from "@ryohey/s-parser"
import { moduleParser } from "./module"
import { assertionParser } from "./assert"
import { array } from "./utils"

export const combinedParser = many(
  or(array(moduleParser), array(assertionParser))
)

// wasm spec test parser
export const wastParser = transform(multiParser, combinedParser)
