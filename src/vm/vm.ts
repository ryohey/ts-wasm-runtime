export type InstructionSet<Code, Memory> = (
  code: Code
) => Instruction<Code, Memory>

// mutates register and memory
export type Instruction<Code, Memory> = (
  code: Code,
  memory: Memory,
  programCounter: Ref<number>
) => void

export interface Ref<T> {
  value: T
}

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

  public run(program: Code[], memory: Memory) {
    const programCounter = { value: 0 }

    while (programCounter.value < program.length) {
      const code = program[programCounter.value++]
      const instr = this.instructionSet(code)
      this.log(`[${programCounter.value}] run ${JSON.stringify(code)}`)
      try {
        instr(code, memory, programCounter)
      } catch (e) {
        console.error(
          `Exception thrown at ${programCounter.value}: ${
            e.message
          } ${JSON.stringify(code)}`
        )
        break
      }
    }
  }

  private log = (msg: string) => {
    if (this.verbose) {
      console.log(msg)
    }
  }
}
