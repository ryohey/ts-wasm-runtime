import { map, seq, Parser, seqMap } from "@ryohey/fn-parser"
import { byte, variable } from "../utils"
import { u32 } from "../number"
import { Bytes } from "../types"

export interface SectionStart {
  id: number
  size: number
}

export interface Section<T> extends SectionStart {
  nodeType: string
  sections: T[]
}

export const sectionStart = (id: number) =>
  map(
    seq(byte(id), u32),
    r =>
      ({
        id,
        size: r[1]
      } as SectionStart)
  )

export const section = <T>(
  id: number,
  nodeType: string,
  body: Parser<Bytes, T[]>
) =>
  seqMap(sectionStart(id), (sec: SectionStart) =>
    map(variable(sec.size), r => {
      const b = body(r, 0)
      return {
        nodeType,
        ...sec,
        sections: b ? b[1] : []
      }
    })
  ) as Parser<Bytes, Section<T>>
