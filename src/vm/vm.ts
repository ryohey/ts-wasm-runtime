export type InstructionSet<Code, Memory> = (
  code: Code
) => Instruction<Code, Memory>

// mutates register and memory
export type Instruction<Code, Memory> = (code: Code, memory: Memory) => void

export interface VMMemory {
  programCounter: number
}

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

  public run(program: Code[], memory: Memory) {
    while (memory.programCounter < program.length) {
      const code = program[memory.programCounter++]
      const instr = this.instructionSet(code)
      this.log(`[${memory.programCounter}] run ${JSON.stringify(code)}`)
      try {
        instr(code, memory)
      } catch (e) {
        console.error(
          `Exception thrown at ${memory.programCounter}: ${
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
