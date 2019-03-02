import { Module } from "@ryohey/wasm-parser"
import { WASMModule, WASMFunction } from "./module"

export const wasmToVMModule = (wasm: Module): WASMModule => {
  const functions = wasm.funcs.map((f, i) => {
    const c = wasm.codes[i]
    const t = wasm.types[f]
    const e = wasm.exports.find(x => "func" in x.desc && x.desc.func === i)
    return {
      export: e ? e.name : null,
      parameters: t.parameters,
      results: t.results,
      body: c.body,
      locals: c.locals
    } as WASMFunction
  })

  const elems = wasm.elems.map(s => ({
    offset: s.offset,
    funcIds: s.init
  }))

  const globals = wasm.globals.map(s => ({
    type: s.type.type,
    mutable: s.type.isMutable,
    init: s.init
  }))

  return {
    functions,
    elems,
    globals
  }
}
