import { WATModule } from "@ryohey/wat-parser"
import { WASMModule } from "../module"
import { replaceIdentifiers } from "./precompile"

export const watModuleToWasmModule = (module: WATModule): WASMModule => {
  module = replaceIdentifiers(module)

  return {
    functions: module.functions.map(fn => ({
      ...fn,
      parameters: fn.parameters.map(p => p.type),
      locals: fn.locals.map(r => r.type)
    })),
    elems: module.elems.map(e => ({
      offset: e.offset,
      funcIds: e.funcIds as number[]
    })),
    globals: module.globals
  }
}
