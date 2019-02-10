import { range } from "@ryohey/array-helper"

export const zeroPad = (binary: string, bitWidth: number): string => {
  return (
    range(0, bitWidth - binary.length)
      .map(_ => "0")
      .join("") + binary
  )
}

export const binToHex = (str: string) =>
  zeroPad(str, Math.ceil(str.length / 8) * 8)
    .match(/.{8}/g)
    .map(n => parseInt(n, 2).toString(16))
    .join("")
