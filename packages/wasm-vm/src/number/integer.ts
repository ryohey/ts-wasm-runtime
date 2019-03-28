export const unsigned = (a: number): number => a >>> 0
export const signed = (a: number): number => a >> 0

export const asSigned = (value: number, bitWidth: number) => {
  const mask = (1 << bitWidth) - 1
  const masked = value & mask
  if (masked >> (bitWidth - 1) === 1) {
    return -(mask - masked + 1)
  }
  return masked
}

const complementTwo = (value: number, bitWidth: number) => {
  const mask = (1 << bitWidth) - 1
  const masked = value & mask
  return -(mask - masked + 1)
}

export interface NumberConvertible {
  toNumber(): number
}

const toIntN = (value: number, bitWidth: number): number => {
  const mask = (1 << bitWidth) - 1
  return value > 0 ? value & mask : complementTwo(Math.abs(value), bitWidth)
}

export const toInt8 = (n: NumberConvertible): number => toIntN(n.toNumber(), 8)
export const toInt16 = (n: NumberConvertible): number =>
  toIntN(n.toNumber(), 16)
export const toInt32 = (n: NumberConvertible): number =>
  toIntN(n.toNumber(), 32)
