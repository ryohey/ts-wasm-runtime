// 戻り値の最後はデバッグ情報
export type Parser<T, S> = (
  target: T,
  position: number
) => [boolean, S, number, string?]

export const token = (word: string): Parser<string, string> => (
  target,
  position
) =>
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

export function seq<T, P0, P1>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>]
): Parser<T, [P0, P1]>
export function seq<T, P0, P1, P2>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>]
): Parser<T, [P0, P1, P2]>
export function seq<T, P0, P1, P2, P3>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>, Parser<T, P3>]
): Parser<T, [P0, P1, P2, P3]>
export function seq<T, P0, P1, P2, P3, P4>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>
  ]
): Parser<T, [P0, P1, P2, P3, P4]>
export function seq<T, P0, P1, P2, P3, P4, P5>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>,
    Parser<T, P5>
  ]
): Parser<T, [P0, P1, P2, P3, P4, P5]>
export function seq<T, P0, P1, P2, P3, P4, P5, P6>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>,
    Parser<T, P5>,
    Parser<T, P6>
  ]
): Parser<T, [P0, P1, P2, P3, P4, P5, P6]>
export function seq<T, S>(...parsers: Parser<T, S>[]): Parser<T, S[]> {
  return (target, position) => {
    const result = []
    for (let parser of parsers) {
      const parsed = parser(target, position)
      if (parsed[0]) {
        result.push(parsed[1])
        position = parsed[2]
      } else {
        return [false, null, position]
      }
    }
    return [true, result, position]
  }
}

export const regexp = (reg: RegExp): Parser<string, string> => (
  target,
  position
) => {
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

export function or<T, P0, P1>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>]
): Parser<T, P0 | P1>
export function or<T, P0, P1, P2>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>]
): Parser<T, P0 | P1 | P2>
export function or<T, S>(...parsers: Parser<T, S>[]): Parser<T, S> {
  return (target, position) => {
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
}

export const lazy = <T, S>(generator: () => Parser<T, S>): Parser<T, S> => {
  let parser: Parser<T, S>
  return (target, position) => {
    if (parser === undefined) {
      parser = generator()
    }
    return parser(target, position)
  }
}

export const opt = <T, S>(parser: Parser<T, S>): Parser<T, S | null> => (
  target,
  position
) => {
  const result = parser(target, position)
  if (result[0]) {
    return result
  }
  return [true, null, position]
}

export const many = <T, S>(parser: Parser<T, S>): Parser<T, S[]> => (
  target,
  position
) => {
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

export const map = <T, S, U>(
  parser: Parser<T, S>,
  transform: (value: S) => U
): Parser<T, U> => (target, position) => {
  const result = parser(target, position)
  if (result[0]) {
    return [result[0], transform(result[1]), result[2]]
  } else {
    return [false, null, result[2]]
  }
}

export const transform = <T, S, U>(
  transformParser: Parser<T, S>,
  parser: Parser<S, U>
): Parser<T, U> => (target, position) => {
  const result = transformParser(target, position)
  if (!result[0]) {
    return [false, null, result[2]]
  }
  return parser(result[1], 0)
}
