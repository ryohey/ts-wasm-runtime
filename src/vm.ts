export type InstructionSet<Code, Memory> = (
  code: Code
) => Instruction<Code, Memory>

// mutates register and memory
export type Instruction<Code, Memory> = (
  code: Code,
  memory: Memory,
  programCounter: number,
  jump: (addr: number) => void
) => void

/**
 * 特定の命令セットやプログラムに依存しない VM の抽象的な実装
 * 利用側が命令セットとプログラムの組み合わせを用意する
 */
export class VirtualMachine<Code, Memory> {
  private memory: Memory
  private instructionSet: InstructionSet<Code, Memory>
  private programCounter: number = 0
  private program: Code[] = []

  constructor(instructionSet: InstructionSet<Code, Memory>) {
    this.instructionSet = instructionSet
  }

  public run(program: Code[], memory: Memory) {
    this.memory = memory
    this.program = program
    this.programCounter = 0

    while (true) {
      try {
        this.eval()
      } catch (e) {
        console.error(e.message)
        break
      }
    }
  }

  private eval() {
    if (this.programCounter >= this.program.length) {
      throw new Error("end of program")
    }
    const code = this.program[this.programCounter++]
    // instruction を実行
    const instr = this.instructionSet(code)
    instr(code, this.memory, this.programCounter, this.jump)
  }

  private jump = (addr: number) => {
    this.programCounter = addr
  }
}
