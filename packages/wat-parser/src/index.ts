import { transform } from "@ryohey/fn-parser"
import { parser as sParser } from "@ryohey/s-parser"
import { moduleParser } from "./module"
export { moduleParser } from "./module"
export const watParser = transform(sParser, moduleParser)
export { wastParser } from "./wast"
export { WATAssertReturn } from "./assert"
import * as TextOp from "./operationTypes"
export { TextOp }
export * from "./moduleTypes"
