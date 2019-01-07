import { range } from "./array"

export const zeroPad = (i: number, bitWidth: number): string => {
  const bin = i.toString(2)
  return (
    range(0, bitWidth - bin.length)
      .map(_ => "0")
      .join("") + bin
  )
}

export const countLeadingZeros = (i: number, bitWidth: number): number => {
  const bin = zeroPad(i, bitWidth)
  const index = bin.indexOf("1")
  return index < 0 ? bitWidth : index
}

export const countTrailingZeros = (i: number, bitWidth: number): number => {
  const bin = zeroPad(i, bitWidth)
  const index = bin.lastIndexOf("1")
  return index < 0 ? bitWidth : bitWidth - (index + 1)
}

export const popCount = (i: number): number => {
  return i
    .toString(2)
    .split("")
    .filter(s => s === "1").length
}
