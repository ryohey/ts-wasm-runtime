import { Parser, or, opt, many, transform } from "../parser/parser"
import { multiParser } from "../s-parser/s-parser"
import { moduleParser } from "./module"
import { assertionParser } from "./assert"
import { array } from "./utils"

export const combinedParser = many(
  or(array(moduleParser), array(assertionParser))
)

// wasm spec test parser
export const wastParser: Parser<string> = transform(multiParser, combinedParser)
