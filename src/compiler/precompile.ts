import { ASTModule } from "../wat-parser/module"
import {
  ASTFunction,
  ASTFunctionInstruction,
  AnyParameter
} from "../wat-parser/func"
import { fromPairs } from "../misc/array"
import { isString } from "util"
import { ASTBlock, isBlockInstruction } from "../wat-parser/block"
import { ASTElem } from "../wat-parser/elem"

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

const isIdentifier = (v: AnyParameter): v is string => {
  return isString(v) && v.startsWith("$")
}

const processInstruction = (
  inst: ASTFunctionInstruction<AnyParameter>,
  idTables: IdentifierTables,
  labelStack: string[]
): ASTFunctionInstruction<AnyParameter> => {
  if (isBlockInstruction(inst)) {
    return processBlock(inst, idTables, labelStack)
  }

  // 変数の identifier を index に置換
  const parameters = inst.parameters.map(p => {
    if (isIdentifier(p)) {
      switch (inst.opType) {
        case "call":
          return idTables.funcs[p]
        case "br":
        case "br_if": {
          return indexFromLast(labelStack, l => l === p)
        }
        default:
          return idTables.locals[p]
      }
    }
    return p
  })

  return {
    ...inst,
    parameters
  }
}

const processBlock = (
  block: ASTBlock,
  idTables: IdentifierTables,
  labelStack: string[]
): ASTBlock => {
  const labels = [...labelStack, block.identifier]
  const body = block.body.map(i => processInstruction(i, idTables, labels))

  return {
    ...block,
    body
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
