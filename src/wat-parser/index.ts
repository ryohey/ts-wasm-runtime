import { transform } from "../parser/parser"
import { parser as sParser } from "../s-parser/s-parser"
import { moduleParser } from "./module"
export { moduleParser } from "./module"
export const watParser = transform(sParser, moduleParser)
