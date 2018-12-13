import { Parser, seq, many, or, opt, map } from "./parser"

type atom = string | number | AtomArray
interface AtomArray extends Array<atom> {}

const isString = (x: any): x is string =>
  typeof x === "string" || x instanceof String

const keyword = (word: string): Parser<atom[]> => (target, position) =>
  target[position] === word
    ? [true, word, position + 1]
    : [
        false,
        null,
        position,
        `keyword@${position}: ${target[position]} is not ${word}`
      ]

const regexp = (reg: RegExp): Parser<atom[]> => (target, position) => {
  const str = target[position]
  if (!isString(str)) {
    return [
      false,
      null,
      position,
      `regexp@${position}: ${target[position]} is not string`
    ]
  }
  reg.lastIndex = 0
  const result = reg.exec(str)
  return result
    ? [true, str, position + 1]
    : [
        false,
        null,
        position,
        `regexp@${position}: ${target[position]} does not match ${reg.source}`
      ]
}

export const num: Parser<atom[]> = (target, position) => {
  if (typeof target[position] !== "number") {
    return [false, null, position, `num@${position}: ${target} is not number`]
  }
  return [true, target[position], position + 1]
}

// 配列内を渡された parser でパースする
const array = (parser: Parser<atom[]>): Parser<atom[]> => (
  target,
  position
) => {
  const arr = target[position]
  if (!Array.isArray(arr)) {
    return [false, null, position, `array@${position}: ${target} is not array`]
  }
  const result = parser(arr, 0)
  if (result[0]) {
    return [true, result[1], position + 1]
  }
  return [false, null, position, result[3]]
}

// https://github.com/WebAssembly/spec/blob/master/interpreter/README.md#s-expression-syntax

const identifier = regexp(/^\$[a-zA-Z][a-zA-Z0-9_.+-\\*/\\^~=<>!?@#$%&|:'`]*$/)
const name = regexp(/^[a-zA-Z]+$/)
const string = regexp(/^\"(.+)\"/)
const _var = or(num, identifier)

/* func */

export interface ASTModuleNode {
  nodeType: string
}

export interface ASTFunctionParameter {
  identifier: string | null
  type: string
}

export interface ASTFunctionResult {
  type: string
}

export interface ASTFunctionInstruction {
  opType: string
  parameters: any
}

export interface ASTFunction extends ASTModuleNode {
  identifier: string | null
  export: string | null
  parameters: ASTFunctionParameter[]
  result: ASTFunctionResult
  body: ASTFunctionInstruction[]
}

const valType = or(
  keyword("i32"),
  keyword("i64"),
  keyword("f32"),
  keyword("f64")
)
const blockType = map(seq(keyword("result"), valType), r => ({
  type: r[1]
}))

export const op = map(
  or(
    keyword("unreachable"),
    keyword("nop"),
    seq(keyword("br"), _var),
    seq(keyword("br_if"), _var),
    seq(keyword("br_table"), many(_var)),
    seq(keyword("return")),
    seq(keyword("call"), _var),
    //   seq(keyword("call_indirect")), <func_type>
    seq(keyword("drop")),
    seq(keyword("select")),
    seq(keyword("get_local"), _var),
    seq(keyword("set_local"), _var),
    seq(keyword("tee_local"), _var),
    seq(keyword("get_global"), _var),
    seq(keyword("set_global"), _var),
    seq(keyword("i32.add"))
    // TODO: Add <val_type>.<binop>
  ),
  r => ({
    opType: r[0],
    parameters: r[1] !== undefined ? r[1] : null
  })
)

const instr = or(op)
export const param: Parser<atom[]> = map(
  seq(keyword("param"), opt(identifier), valType),
  r => ({ identifier: r[1], type: r[2] })
)

// とりあえず適当
export const funcBody = many(instr)

export const func: Parser<atom[]> = map(
  seq(
    keyword("func"),
    opt(identifier),
    opt(map(array(seq(keyword("export"), string)), r => r[1])),
    opt(many(array(param))),
    opt(array(blockType)),
    funcBody
  ),
  r => {
    return {
      nodeType: "func",
      identifier: r[1],
      export: r[2],
      parameters: r[3],
      result: r[4],
      body: r[5]
    } as ASTFunction
  }
)

/* module */

export interface ASTModule {
  nodeType: "module"
  functions: ASTFunction[]
  // types
  // tables
  // globals
  // memories
}

const moduleExport = seq(
  keyword("export"),
  string,
  or(
    array(seq(keyword("func"), identifier)),
    array(seq(keyword("memory"), identifier))
  )
)

export const moduleParser = map(
  seq(keyword("module"), many(or(array(moduleExport), array(func)))),
  r => {
    return {
      nodeType: "module",
      functions: r[1].filter(n => n.nodeType === "func")
    }
  }
)
