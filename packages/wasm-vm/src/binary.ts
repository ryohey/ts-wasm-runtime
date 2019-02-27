import { Module, AnySection } from "@ryohey/wasm-parser"
import { WASMModule, WASMFunction } from "./module"
import { Section } from "@ryohey/wasm-parser/dist/sections/section"
import { Code } from "@ryohey/wasm-parser/dist/sections/code"
import { Elem } from "@ryohey/wasm-parser/dist/sections/elem"
import { flatten } from "@ryohey/array-helper"
import { Type } from "@ryohey/wasm-parser/dist/sections/type"
import { Export } from "@ryohey/wasm-parser/dist/sections/export"
import { Op } from "@ryohey/wasm-ast"
import { convertNumber } from "./number/convert"
import { Global } from "@ryohey/wasm-parser/dist/sections/global"

const isCode = (x: AnySection): x is Section<Code> => x.nodeType === "code"
const isElem = (x: AnySection): x is Section<Elem> => x.nodeType === "elem"
const isType = (x: AnySection): x is Section<Type> => x.nodeType === "type"
const isExport = (x: AnySection): x is Section<Export> =>
  x.nodeType === "export"
const isGlobal = (x: AnySection): x is Section<Global> =>
  x.nodeType === "global"

export const wasmToVMModule = (wasm: Module): WASMModule => {
  const typeSections = flatten(
    wasm.sections.filter(isType).map(s => s.sections)
  )
  const codeSections = flatten(
    wasm.sections.filter(isCode).map(s => s.sections)
  )
  const exportSections = flatten(
    wasm.sections.filter(isExport).map(s => s.sections)
  )
  const elemSections = flatten(
    wasm.sections.filter(isElem).map(s => s.sections)
  )
  const globalSections = flatten(
    wasm.sections.filter(isGlobal).map(s => s.sections)
  )

  const functions = codeSections.map((s, i) => {
    const t = typeSections[i]
    const e = exportSections.find(x => "func" in x.desc && x.desc.func === i)
    return {
      export: e ? e.name : null,
      parameters: t.parameters,
      results: t.results,
      body: s.body,
      locals: s.locals
    } as WASMFunction
  })

  const elems = elemSections.map(s => ({
    offset: convertNumber((s.offset[0] as Op.Const).parameter).toNumber(),
    funcIds: s.init
  }))

  const globals = globalSections.map(s => ({
    type: s.type.type,
    mutable: s.type.isMutable,
    initialValue: (s.init[0] as Op.Const).parameter
  }))

  return {
    functions,
    elems,
    globals
  }
}
