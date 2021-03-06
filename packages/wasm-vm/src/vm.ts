export type InstructionSet<Code, Memory> = (code: Code) => Instruction<Memory>

// mutates register and memory
export type Instruction<Memory> = (memory: Memory) => void

export interface VMMemory {
  programCounter: number
  programTerminated: boolean
}

/**
 * 特定の命令セットやプログラムに依存しない VM の抽象的な実装
 * 利用側が命令セットとプログラムの組み合わせを用意する
 */
export const virtualMachine = <Code, Memory extends VMMemory>(
  instructionSet: InstructionSet<Code, Memory>,
  verbose: boolean = false
) => (program: Code[], memory: Memory) => {
  const log = (...args: any) => {
    if (verbose) {
      console.log(...args)
    }
  }

  while (memory.programCounter < program.length && !memory.programTerminated) {
    const code = program[memory.programCounter++]
    const instr = instructionSet(code)
    log("[%d] run %o", memory.programCounter, code)
    try {
      instr(memory)
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
