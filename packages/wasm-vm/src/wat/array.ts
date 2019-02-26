export const fromPairs = <V>(entries: [string, V][]): { [key: string]: V } => {
  const obj = {}
  for (const [k, v] of entries) {
    obj[k] = v
  }
  return obj
}
