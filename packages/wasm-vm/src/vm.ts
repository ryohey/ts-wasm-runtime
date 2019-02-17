export type InstructionSet<Code, Memory> = (code: Code) => Instruction<Memory>

// mutates register and memory
export type Instruction<Memory> = (memory: Memory, br: BreakFunc) => void

export interface VMMemory {
  programCounter: number
}

export enum BreakPosition {
  tail,
  head
}

export type BreakFunc = (level: number) => void

/**
 * 特定の命令セットやプログラムに依存しない VM の抽象的な実装
 * 利用側が命令セットとプログラムの組み合わせを用意する
 */
export const virtualMachine = <Code, Memory extends VMMemory>(
  instructionSet: InstructionSet<Code, Memory>,
  verbose: boolean = false
) => (
  program: Code[],
  memory: Memory,
  breakPosition: BreakPosition = BreakPosition.tail
) => {
  const log = (msg: string) => {
    if (verbose) {
      console.log(msg)
    }
  }

  let breakLevel = 0
  const break_: BreakFunc = level => {
    memory.programCounter = (() => {
      switch (breakPosition) {
        case BreakPosition.tail:
          return program.length
        case BreakPosition.head:
          return 0
      }
    })()
    breakLevel = level
  }

  while (memory.programCounter < program.length) {
    const code = program[memory.programCounter++]
    const instr = instructionSet(code)
    log(`[${memory.programCounter}] run ${JSON.stringify(code)}`)
    try {
      instr(memory, break_)
    } catch (e) {
      console.error(
        `Exception thrown at ${memory.programCounter}: ${
          e.message
        } ${JSON.stringify(code)}`
      )
      break
    }
  }

  // pass remained break count to break nested call
  return breakLevel
}
