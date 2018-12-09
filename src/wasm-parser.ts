import { Parser, seq, many, or, opt, map } from "./parser"

type atom = string | number | AtomArray
interface AtomArray extends Array<atom> {}

const isString = (x: any): x is string =>
  typeof x === "string" || x instanceof String

const keyword = (word: string): Parser<atom[]> => (target, position) =>
  target[position] === word
    ? [true, word, position + 1]
    : [false, null, position]

const regexp = (reg: RegExp): Parser<atom[]> => (target, position) => {
  const str = target[position]
  if (!isString(str)) {
    return [false, null, position]
  }
  reg.lastIndex = 0
  const result = reg.exec(str)
  return result ? [true, str, position + 1] : [false, null, position]
}

export const num: Parser<atom[]> = (target, position) => {
  if (typeof target[position] !== "number") {
    return [false, null, position]
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
    return [false, null, position]
  }
  const result = parser(arr, 0)
  if (result[0]) {
    return [true, result[1], position + 1]
  }
  return [false, null, position]
}

// https://github.com/WebAssembly/spec/blob/master/interpreter/README.md#s-expression-syntax

const name = regexp(/^\$[a-zA-Z][a-zA-Z0-9_.+-\\*/\\^~=<>!?@#$%&|:'`]*$/)
const string = regexp(/^\"(.+)\"/)
const _var = or(num, name)

/* func */

const valType = or(
  keyword("i32"),
  keyword("i64"),
  keyword("f32"),
  keyword("f64")
)
const blockType = map(seq(keyword("result"), valType), r => ({
  nodeType: "result",
  type: r[1]
}))
const op = map(
  or(
    array(seq(keyword("unreachable"))),
    array(seq(keyword("nop"))),
    array(seq(keyword("br"), _var)),
    array(seq(keyword("br_if"), _var)),
    array(seq(keyword("br_table"), many(_var))),
    array(seq(keyword("return"))),
    array(seq(keyword("call"), _var)),
    //   seq(keyword("call_indirect")), <func_type>
    array(seq(keyword("drop"))),
    array(seq(keyword("select"))),
    array(seq(keyword("get_local"), _var)),
    array(seq(keyword("set_local"), _var)),
    array(seq(keyword("tee_local"), _var)),
    array(seq(keyword("get_global"), _var)),
    array(seq(keyword("set_global"), _var)),
    array(seq(keyword("i32.add")))
    // TODO: Add <val_type>.<binop>
  ),
  r => ({
    nodeType: "op",
    opType: r[0],
    parameters: r[1] !== undefined ? r[1] : null
  })
)

const instr = or(op)
export const param: Parser<atom[]> = map(
  seq(keyword("param"), opt(name), valType),
  r => ({ nodeType: "param", name: r[1], type: r[2] })
)

// とりあえず適当
export const funcBody = many(instr)

const func: Parser<atom[]> = map(
  seq(
    keyword("func"),
    opt(many(array(param))),
    opt(array(blockType)),
    funcBody
  ),
  r => {
    return {
      nodeType: "func",
      parameters: r[1],
      result: r[2],
      body: r[3]
    }
  }
)

/* module */

const moduleExport = seq(
  keyword("export"),
  string,
  or(array(seq(keyword("func"), name)), array(seq(keyword("memory"), name)))
)

const module = seq(keyword("module"), many(or(moduleExport, func)))

export const parser = func
