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
  public programCounter: number = 0
  private program: Code[] = []

  constructor(instructionSet: InstructionSet<Code, Memory>) {
    this.instructionSet = instructionSet
  }

  public initialize(program: Code[], memory: Memory) {
    this.memory = memory
    this.program = program
  }

  public run(addr: number) {
    this.programCounter = addr

    while (true) {
      try {
        if (!this.eval()) {
          break
        }
      } catch (e) {
        console.error(e.message)
        break
      }
    }
  }

  public runInstruction(code: Code) {
    console.log(`[${this.programCounter}] run ${JSON.stringify(code)}`)
    const instr = this.instructionSet(code)
    instr(code, this.memory, this.programCounter, this.jump)
  }

  private eval() {
    if (this.programCounter >= this.program.length) {
      // "end of program"
      return false
    }
    const code = this.program[this.programCounter++]
    this.runInstruction(code)
    return true
  }

  private jump = (addr: number) => {
    this.programCounter = addr
  }
}
