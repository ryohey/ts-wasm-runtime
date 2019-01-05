export const flatten = <T>(arr: T[][]): T[] => [].concat(...arr)

export const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, k) => k + start)

export const uniq = <T>(arr: T[]): T[] => [...new Set(arr)]

export const fromPairs = <V>(entries: [string, V][]): { [key: string]: V } => {
  const obj = {}
  for (const [k, v] of entries) {
    obj[k] = v
  }
  return obj
}
