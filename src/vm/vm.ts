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
  public verbose: boolean = true
  private memory: Memory
  private instructionSet: InstructionSet<Code, Memory>
  private program: Code[] = []

  constructor(instructionSet: InstructionSet<Code, Memory>) {
    this.instructionSet = instructionSet
  }

  public initialize(program: Code[], memory: Memory) {
    this.memory = memory
    this.program = program
  }

  public run() {
    while (this.memory.programCounter < this.program.length) {
      const code = this.program[this.memory.programCounter++]
      const instr = this.instructionSet(code)
      this.log(`[${this.memory.programCounter}] run ${JSON.stringify(code)}`)
      try {
        instr(code, this.memory)
      } catch (e) {
        console.error(e.message)
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
