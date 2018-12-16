// 戻り値の最後はデバッグ情報
export type Parser<T> = (
  target: T,
  position: number
) => [boolean, any, number, string?]

export const token = (word: string): Parser<string> => (target, position) =>
  target.substr(position, word.length) === word
    ? [true, word, position + word.length]
    : [
        false,
        null,
        position,
        `token@${position}: ${target.substr(
          position,
          word.length
        )} is not ${word}`
      ]

export const seq = <T>(...parsers: Parser<T>[]): Parser<T> => (
  target,
  position
) => {
  const result = []
  for (let parser of parsers) {
    const parsed = parser(target, position)
    if (parsed[0]) {
      result.push(parsed[1])
      position = parsed[2]
    } else {
      return parsed
    }
  }
  return [true, result, position]
}

export const regexp = (reg: RegExp): Parser<string> => (target, position) => {
  reg.lastIndex = 0
  const result = reg.exec(target.slice(position))
  return result
    ? [true, result[0], position + result[0].length]
    : [
        false,
        null,
        position,
        `regexp@${position}: ${target.slice(position)} does not match ${
          reg.source
        }`
      ]
}

export const or = <T>(...parsers: Parser<T>[]): Parser<T> => (
  target,
  position
) => {
  for (let parser of parsers) {
    const parsed = parser(target, position)
    if (parsed[0]) {
      return parsed
    }
  }
  return [
    false,
    null,
    position,
    `or@${position}: cannot parse ${target} with ${parsers
      .map(p => p.name)
      .join(", ")}`
  ]
}

export const lazy = <T>(generator: () => Parser<T>): Parser<T> => {
  let parser: Parser<T>
  return (target, position) => {
    if (parser === undefined) {
      parser = generator()
    }
    return parser(target, position)
  }
}

export const opt = <T>(parser: Parser<T>): Parser<T> => (target, position) => {
  const result = parser(target, position)
  if (result[0]) {
    return result
  }
  return [true, null, position]
}

export const many = <T>(parser: Parser<T>): Parser<T> => (target, position) => {
  const result = []
  while (true) {
    const parsed = parser(target, position)
    if (parsed[0]) {
      result.push(parsed[1])
      position = parsed[2]
    } else {
      break
    }
  }
  if (result.length === 0) {
    return [false, null, position, `many@${position}: cannot parse`]
  }
  return [true, result, position]
}

export const map = <T>(
  parser: Parser<T>,
  transform: (any) => any
): Parser<T> => (target, position) => {
  const result = parser(target, position)
  if (result[0]) {
    return [result[0], transform(result[1]), result[2]]
  } else {
    return result
  }
}
