export const flatten = <T>(arr: T[][]): T[] => [].concat(...arr)

export const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, k) => k + start)
