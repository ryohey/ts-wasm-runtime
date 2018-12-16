import { assertionParser } from "./assert"
import { or, opt, many } from "../parser/parser"
import { moduleParser } from "./module"

export const wasmParser = or(moduleParser, opt(many(assertionParser)))
