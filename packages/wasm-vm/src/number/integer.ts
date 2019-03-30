export const unsigned = (a: number): number => a >>> 0
export const signed = (a: number): number => a >> 0

const bitMask = (width: number) => Math.pow(2, width) - 1

export const asSigned = (value: number, bitWidth: number) => {
  const mask = bitMask(bitWidth)
  const masked = value & mask
  if (masked >> (bitWidth - 1) === 1) {
    return -(mask - masked + 1)
  }
  return masked
}
