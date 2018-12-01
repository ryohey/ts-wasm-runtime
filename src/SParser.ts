import { Parser, regexp, or, seq, token, lazy } from "./parser"

const float = regexp(/^[0-9]+\.[0-9]+/)
const integer = regexp(/^[0-9]+/)
const text = regexp(/^[0-9a-zA-Z]+/)
const types = or(float, integer, text)
// FIXME: スペースを考慮する
const parentheses = lazy(() => seq(token("("), expression, token(")")))
const expression = or(types, parentheses)

export const parser = expression
