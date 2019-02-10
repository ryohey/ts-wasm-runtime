import { Parser, or, seq, lazy, opt, many, map } from "@ryohey/fn-parser"

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
