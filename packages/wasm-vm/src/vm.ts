export type InstructionSet<Code, Memory> = (code: Code) => Instruction<Memory>

// mutates register and memory
export type Instruction<Memory> = (memory: Memory) => void

export interface VMMemory {
  programCounter: number
}

/**
 * 特定の命令セットやプログラムに依存しない VM の抽象的な実装
 * 利用側が命令セットとプログラムの組み合わせを用意する
 */
export const virtualMachine = <Code, Memory extends VMMemory>(
  instructionSet: InstructionSet<Code, Memory>,
  verbose: boolean = false
) => (program: Code[], memory: Memory) => {
  const log = (msg: string) => {
    if (verbose) {
      console.log(msg)
    }
  }

  while (memory.programCounter < program.length) {
    const code = program[memory.programCounter++]
    const instr = instructionSet(code)
    log(`[${memory.programCounter}] run ${JSON.stringify(code)}`)
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
