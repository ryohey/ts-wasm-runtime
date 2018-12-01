export type Parser = (
  target: string,
  position: number
) => [boolean, any, number]

export const token = (word: string): Parser => (target, position) =>
  target.substr(position, word.length) === word
    ? [true, word, position + word.length]
    : [false, null, position]

export const seq = (...parsers: Parser[]): Parser => (target, position) => {
  const result = []
  for (let parser of parsers) {
    const parsed = parser(target, position)
    if (parsed[0]) {
      console.log("seq: ", parsed[1])
      result.push(parsed[1])
      position = parsed[2]
    } else {
      return parsed
    }
  }
  return [true, result, position]
}

export const regexp = (reg: RegExp): Parser => (target, position) => {
  reg.lastIndex = 0
  const result = reg.exec(target.slice(position))
  return result
    ? [true, result[0], position + result[0].length]
    : [false, null, position]
}

export const or = (...parsers: Parser[]): Parser => (target, position) => {
  for (let parser of parsers) {
    const parsed = parser(target, position)
    if (parsed[0]) {
      return parsed
    }
  }
  return [false, null, position]
}

export const lazy = (generator: () => Parser): Parser => {
  let parser: Parser
  return (target, position) => {
    if (parser === undefined) {
      parser = generator()
    }
    return parser(target, position)
  }
}
