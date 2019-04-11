import { fromPairs } from "./array"
import { WATFunction, WATElem, WATModule, TextOp } from "@ryohey/wat-parser"
import { Op } from "@ryohey/wasm-ast"
import { WASMFunction, WASMElem, WASMModule } from "../module"

const isString = (x: any): x is string => typeof x === "string"

type IdentifierEntry = { [key: string]: number }

interface IdentifierTables {
  locals: IdentifierEntry
  globals: IdentifierEntry
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

const resolveInitializer = (init: TextOp.Initializer): Op.Initializer => {
  switch (init.opType) {
    case "text.get_global":
    case "text.global.get":
      throw new Error("not implemented")
  }
  return init
}

const processInstruction = (
  inst: TextOp.Any,
  idTables: IdentifierTables,
  labelStack: string[]
): Op.Any => {
  // 変数の identifier を index に置換
  const resolveBlockLabel = (p: string | number) =>
    isIdentifier(p) ? indexFromLast(labelStack, l => l === p) : p
  const resolveGlobalLabel = (p: string | number) =>
    isIdentifier(p) ? idTables.globals[p] : p
  const resolveLocalLabel = (p: string | number) =>
    isIdentifier(p) ? idTables.locals[p] : p
  const resolveFuncLabel = (p: string | number) =>
    isIdentifier(p) ? idTables.funcs[p] : p

  switch (inst.opType) {
    case "text.if":
      return processIf(inst, idTables, labelStack)
    case "text.block":
      return processBlock("block", inst, idTables, labelStack)
    case "text.loop":
      return processBlock("loop", inst, idTables, labelStack)
    case "text.call":
      return {
        opType: "call",
        parameter: resolveFuncLabel(inst.parameter)
      }
    case "text.br":
      return {
        opType: "br",
        parameter: resolveBlockLabel(inst.parameter)
      } as Op.Br
    case "text.br_if":
      return {
        opType: "br_if",
        parameter: resolveBlockLabel(inst.parameter)
      } as Op.BrIf
    case "text.br_table":
      return {
        opType: "br_table",
        parameters: inst.parameters.map(resolveBlockLabel)
      } as Op.BrTable
    case "text.local.get":
      return {
        opType: "local.get",
        parameter: resolveLocalLabel(inst.parameter)
      } as Op.Local_get
    case "text.local.set":
      return {
        opType: "local.set",
        parameter: resolveLocalLabel(inst.parameter)
      } as Op.Local_set
    case "text.local.tee":
      return {
        opType: "local.tee",
        parameter: resolveLocalLabel(inst.parameter)
      } as Op.Local_tee
    case "text.get_local":
      return {
        opType: "get_local",
        parameter: resolveLocalLabel(inst.parameter)
      } as Op.Get_local
    case "text.set_local":
      return {
        opType: "set_local",
        parameter: resolveLocalLabel(inst.parameter)
      } as Op.Set_local
    case "text.tee_local":
      return {
        opType: "tee_local",
        parameter: resolveLocalLabel(inst.parameter)
      } as Op.Tee_local
    case "text.global.get":
      return {
        opType: "global.get",
        parameter: resolveGlobalLabel(inst.parameter)
      } as Op.Global_get
    case "text.global.set":
      return {
        opType: "global.set",
        parameter: resolveGlobalLabel(inst.parameter)
      } as Op.Global_set
    case "text.get_global":
      return {
        opType: "get_global",
        parameter: resolveGlobalLabel(inst.parameter)
      } as Op.Get_global
    case "text.set_global":
      return {
        opType: "set_global",
        parameter: resolveGlobalLabel(inst.parameter)
      } as Op.Set_global
  }

  return inst
}

const processBlock = <T extends Op.Block | Op.Loop>(
  opType: T["opType"],
  block: TextOp.Block | TextOp.Loop,
  idTables: IdentifierTables,
  labelStack: string[]
): T => {
  const labels = [...labelStack, block.identifier]
  const body = block.body.map(i => processInstruction(i, idTables, labels))

  return {
    opType,
    body,
    results: block.results
  } as T
}

const processIf = (
  block: TextOp.If,
  idTables: IdentifierTables,
  labelStack: string[]
): Op.If => {
  const labels = [...labelStack, block.identifier]

  return {
    opType: "if",
    results: block.results,
    then: block.then.map(i => processInstruction(i, idTables, labels)),
    else: block.else.map(i => processInstruction(i, idTables, labels))
  }
}

const createLocalTables = (ast: WATFunction) => {
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
  fn: WATFunction,
  funcs: IdentifierEntry,
  globals: IdentifierEntry
): WASMFunction => {
  const idTables: IdentifierTables = {
    locals: createLocalTables(fn),
    globals,
    funcs
  }
  return {
    body: fn.body.map(i => processInstruction(i, idTables, [])),
    parameters: fn.parameters.map(p => p.type),
    locals: fn.locals.map(r => r.type),
    export: fn.export,
    results: fn.results
  }
}

const processElem = (ast: WATElem, funcTable: IdentifierEntry): WASMElem => {
  const funcIds = ast.funcIds.map(id => (isIdentifier(id) ? funcTable[id] : id))
  return {
    offset: resolveInitializer(ast.offset),
    funcIds
  }
}

export const processModule = (ast: WATModule): WASMModule => {
  const funcTable: IdentifierEntry = fromPairs(
    ast.functions
      .map((fn, i) => [fn.identifier, i] as [string, number])
      .filter(e => e[0])
  )

  const globalTable: IdentifierEntry = fromPairs(
    ast.globals
      .map((fn, i) => [fn.identifier, i] as [string, number])
      .filter(e => e[0])
  )

  return {
    elems: ast.elems.map(elem => processElem(elem, funcTable)),
    functions: ast.functions.map(fn =>
      processFunction(fn, funcTable, globalTable)
    ),
    globals: ast.globals.map(g => ({
      ...g,
      init: resolveInitializer(g.init)
    }))
  }
}
