// 戻り値の最後はデバッグ情報
export type Parser<T, S> = (
  target: T,
  position: number
) => [boolean, S, number, string?]

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
export function seq<T, P0>(...parsers: Parser<T, P0>[]): Parser<T, P0[]>
export function seq<T, S>(...parsers: Parser<T, S>[]): Parser<T, S[]> {
  return (target, position) => {
    const result = []
    for (let parser of parsers) {
      const parsed = parser(target, position)
      if (parsed[0]) {
        result.push(parsed[1])
        position = parsed[2]
      } else {
        return [false, null, position, `seq@${position}: ${parsed[3]}`]
      }
    }
    return [true, result, position]
  }
}

export function or<T, S>(...parsers: Parser<T, S>[]): Parser<T, S>
export function or<T, P0, P1>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>]
): Parser<T, P0 | P1>
export function or<T, P0, P1, P2>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>]
): Parser<T, P0 | P1 | P2>
export function or<T, P0, P1, P2, P3>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>, Parser<T, P3>]
): Parser<T, P0 | P1 | P2 | P3>
export function or<T, P0, P1, P2, P3, P4>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>
  ]
): Parser<T, P0 | P1 | P2 | P3 | P4>
export function or<T, P0, P1, P2, P3, P4, P5>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>,
    Parser<T, P5>
  ]
): Parser<T, P0 | P1 | P2 | P3 | P4 | P5>
export function or<T>(...parsers: Parser<T, any>[]): Parser<T, any> {
  return (target, position) => {
    const errors: string[] = []
    for (let parser of parsers) {
      const parsed = parser(target, position)
      if (parsed[0]) {
        return parsed
      } else {
        errors.push(parser[2])
      }
    }
    return [
      false,
      null,
      position,
      `or@${position}: expected ${errors.join(" or ")}`
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
  return [true, null, position, `opt@${position}: ${result[3]}`]
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
    return [false, null, result[2], `map@${position}: ${result[3]}`]
  }
}

export const transform = <T, S, U>(
  transformParser: Parser<T, S>,
  parser: Parser<S, U>
): Parser<T, U> => (target, position) => {
  const result = transformParser(target, position)
  if (!result[0]) {
    return [false, null, position, `transform@${position}: ${result[2]}`]
  }
  return parser(result[1], 0)
}

export const fail: Parser<any, null> = (_: any, position: number) => [
  false,
  null,
  position,
  `fail@${position}`
]

export const pass = <T>(target: T[], position: number) =>
  [true, target[position], position + 1] as ReturnType<Parser<T[], T>>

export const seqMap = <T, S, R>(
  parser: Parser<T, S>,
  next: (value: S) => Parser<T, R>
): Parser<T, R> => (target, position) => {
  const result = parser(target, position)
  if (!result[0]) {
    return [false, null, position, result[3]]
  }
  return next(result[1])(target, result[2])
}

export const vec = <T, S>(
  parser: Parser<T, S>,
  size: number
): Parser<T, S[]> => (target, position) => {
  const result = []
  for (let i = 0; i < size; i++) {
    const parsed = parser(target, position)
    if (parsed[0]) {
      result.push(parsed[1])
      position = parsed[2]
    } else {
      return [false, null, position, `vec@${position}: ${parsed[3]}`]
    }
  }
  return [true, result, position]
}

// this does not advance the position, but succeeds to parse and returns result
export const terminate = <S, T>(result: T): Parser<S, T> => (_, position) => [
  true,
  result,
  position
]
