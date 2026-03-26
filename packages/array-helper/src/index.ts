export const flatten = <T>(arr: T[][]): T[] => arr.flat()

export const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, k) => k + start)
