import { terminate } from "@ryohey/fn-parser"
import { section } from "./section"

export const customSection = section(0, "custom", terminate([]))
