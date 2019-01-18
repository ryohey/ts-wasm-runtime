import { range } from "./array"

export const zeroPad = (binary: string, bitWidth: number): string => {
  return (
    range(0, bitWidth - binary.length)
      .map(_ => "0")
      .join("") + binary
  )
}

export const countLeadingZeros = (binary: string, bitWidth: number): number => {
  const bin = zeroPad(binary, bitWidth)
  const index = bin.indexOf("1")
  return index < 0 ? bitWidth : index
}

export const countTrailingZeros = (
  binary: string,
  bitWidth: number
): number => {
  const bin = zeroPad(binary, bitWidth)
  const index = bin.lastIndexOf("1")
  return index < 0 ? bitWidth : bitWidth - (index + 1)
}

export const popCount = (binary: string): number => {
  return binary.split("").filter(s => s === "1").length
}
