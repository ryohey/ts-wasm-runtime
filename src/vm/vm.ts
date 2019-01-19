export type InstructionSet<Code, Memory> = (
  code: Code
) => Instruction<Code, Memory>

// mutates register and memory
export type Instruction<Code, Memory> = (
  code: Code,
  memory: Memory,
  programCounter: Ref<number>,
  br: BreakFunc
) => void

export interface Ref<T> {
  value: T
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
export class VirtualMachine<Code, Memory> {
  public verbose: boolean
  private instructionSet: InstructionSet<Code, Memory>

  constructor(instructionSet: InstructionSet<Code, Memory>) {
    this.instructionSet = instructionSet
  }

  public run(
    program: Code[],
    memory: Memory,
    breakPosition: BreakPosition = BreakPosition.tail
  ) {
    const programCounter = { value: 0 }
    let breakLevel = 0
    const break_: BreakFunc = level => {
      programCounter.value = (() => {
        switch (breakPosition) {
          case BreakPosition.tail:
            return program.length
          case BreakPosition.head:
            return 0
        }
      })()
      breakLevel = level
    }

    while (programCounter.value < program.length) {
      const code = program[programCounter.value++]
      const instr = this.instructionSet(code)
      this.log(`[${programCounter.value}] run ${JSON.stringify(code)}`)
      try {
        instr(code, memory, programCounter, break_)
      } catch (e) {
        console.error(
          `Exception thrown at ${programCounter.value}: ${
            e.message
          } ${JSON.stringify(code)}`
        )
        break
      }
    }

    return breakLevel
  }

  private log = (msg: string) => {
    if (this.verbose) {
      console.log(msg)
    }
  }
}
