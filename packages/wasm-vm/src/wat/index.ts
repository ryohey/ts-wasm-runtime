import { WATModule } from "@ryohey/wat-parser"
import { Int32 } from "../number"
import { WASMModule } from "../module"
import { replaceIdentifiers } from "./precompile"

export const watModuleToWasmModele = (module: WATModule): WASMModule => {
  module = replaceIdentifiers(module)

  return {
    functions: module.functions.map(fn => ({
      ...fn,
      parameters: fn.parameters.map(p => p.type),
      locals: fn.locals.map(r => r.type)
    })),
    elems: module.elems.map(e => ({
      offset: Int32.obj(e.offset).toNumber(),
      funcIds: e.funcIds as number[]
    })),
    globals: module.globals
  }
}
