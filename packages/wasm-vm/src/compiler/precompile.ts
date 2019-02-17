import { fromPairs } from "./array"
import { ASTFunction, ASTElem, ASTModule } from "@ryohey/wasm-ast"
import { Op } from "@ryohey/wasm-ast"

const isString = (x: any): x is string => typeof x === "string"

type IdentifierEntry = { [key: string]: number }

interface IdentifierTables {
  locals: IdentifierEntry
  funcs: IdentifierEntry
}

const indexFromLast = <T>(arr: T[], pred: (item: T) => boolean): number => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (pred(arr[i])) {
      return arr.length - i - 1
    }
  }
  return -1
}

const isIdentifier = (v: any): v is string => {
  return isString(v) && v.startsWith("$")
}

const isIfInstruction = (inst: Op.Any): inst is Op.If => inst.opType === "if"

const processInstruction = (
  inst: Op.Any,
  idTables: IdentifierTables,
  labelStack: string[]
): Op.Any => {
  if (isIfInstruction(inst)) {
    return processIf(inst, idTables, labelStack)
  }
  if (inst.opType === "block" || inst.opType === "loop") {
    return processBlock(inst, idTables, labelStack)
  }

  const labelToIndex = (p: string) => indexFromLast(labelStack, l => l === p)

  if (inst.opType === "br_table") {
    return {
      ...inst,
      parameters: inst.parameters.map(p =>
        isIdentifier(p) ? labelToIndex(p) : p
      )
    }
  }

  // 変数の identifier を index に置換
  if ("parameter" in inst) {
    const p = inst.parameter
    if (isIdentifier(p)) {
      switch (inst.opType) {
        case "call":
          return {
            ...inst,
            parameter: idTables.funcs[p]
          }
        case "br":
        case "br_if":
          return { ...inst, parameter: labelToIndex(p) }
        case "local.get":
        case "local.set":
        case "local.tee":
        case "get_local":
        case "set_local":
        case "tee_local":
        case "global.get":
        case "global.set":
        case "get_global":
        case "set_global":
          return {
            ...inst,
            parameter: idTables.locals[p]
          }
      }
    }
  }

  return inst
}

const processBlock = (
  block: Op.Block | Op.Loop,
  idTables: IdentifierTables,
  labelStack: string[]
): Op.Block | Op.Loop => {
  const labels = [...labelStack, block.identifier]
  const body = block.body.map(i => processInstruction(i, idTables, labels))

  return {
    ...block,
    body
  }
}

const processIf = (
  block: Op.If,
  idTables: IdentifierTables,
  labelStack: string[]
): Op.If => {
  const labels = [...labelStack, block.identifier]

  return {
    ...block,
    then: block.then.map(i => processInstruction(i, idTables, labels)),
    else: block.else.map(i => processInstruction(i, idTables, labels))
  }
}

const createLocalTables = (ast: ASTFunction) => {
  const params = fromPairs(
    ast.parameters
      .map((p, i) => [p.identifier, i] as [string, number])
      .filter(e => e[0])
  )

  const locals = fromPairs(
    ast.locals
      .map(
        (p, i) => [p.identifier, ast.parameters.length + i] as [string, number]
      )
      .filter(e => e[0])
  )

  return { ...params, ...locals }
}

const processFunction = (
  ast: ASTFunction,
  funcTable: IdentifierEntry
): ASTFunction => {
  const idTables: IdentifierTables = {
    locals: createLocalTables(ast),
    funcs: funcTable
  }
  const body = ast.body.map(i => processInstruction(i, idTables, []))
  return {
    ...ast,
    body
  }
}

const processElem = (ast: ASTElem, funcTable: IdentifierEntry): ASTElem => {
  const funcIds = ast.funcIds.map(id => (isIdentifier(id) ? funcTable[id] : id))
  return {
    ...ast,
    funcIds
  }
}

export const replaceIdentifiers = (ast: ASTModule): ASTModule => {
  const funcTable: IdentifierEntry = fromPairs(
    ast.functions
      .map((fn, i) => [fn.identifier, i] as [string, number])
      .filter(e => e[0])
  )

  return {
    ...ast,
    elems: ast.elems.map(elem => processElem(elem, funcTable)),
    functions: ast.functions.map(fn => processFunction(fn, funcTable))
  }
}
