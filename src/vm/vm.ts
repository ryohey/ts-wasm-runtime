export type InstructionSet<Code, Memory> = (
  code: Code
) => Instruction<Code, Memory>

// mutates register and memory
export type Instruction<Code, Memory> = (
  code: Code,
  memory: Memory,
  br: BreakFunc
) => void

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
export class VirtualMachine<Code, Memory extends VMMemory> {
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
      const instr = this.instructionSet(code)
      this.log(`[${memory.programCounter}] run ${JSON.stringify(code)}`)
      try {
        instr(code, memory, break_)
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

  private log = (msg: string) => {
    if (this.verbose) {
      console.log(msg)
    }
  }
}
