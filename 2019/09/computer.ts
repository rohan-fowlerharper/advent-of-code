export default function createComputer(phase: number, memory: number[]) {
  let i = 0
  let phaseUsed = false
  let output = -1
  let relativeBase = 0

  const getParams = (instruction: string[], i: number) => {
    const modes = instruction.slice(0, instruction.length - 2).reverse()

    const getPosition = (mode: string, index: number) => {
      if (mode === '0') return memory[index]
      if (mode === '1') return index
      if (mode === '2') return memory[index] + relativeBase
      throw new Error('Invalid mode')
    }

    return [
      getPosition(modes[0], i + 1),
      getPosition(modes[1], i + 2),
      getPosition(modes[2], i + 3),
    ]
  }

  const mapParamsToMemory = (params: number[]) => {
    return params.map((param) => memory[param])
  }

  const parseInstruction = (instr: number) => {
    const instruction = instr.toString().padStart(5, '0').split('')
    const op = Number(instruction.slice(-2, instruction.length).join(''))
    const params = getParams(instruction, i)

    return { op, params }
  }

  const run = (input?: number): { output: number; done: boolean } => {
    while (true) {
      const { op, params } = parseInstruction(memory[i])

      switch (op) {
        case 1:
        case 2: {
          const [a, b] = mapParamsToMemory(params)
          const c = params[2]

          if (op === 1) memory[c] = a + b
          else if (op === 2) memory[c] = a * b

          i += 4
          break
        }
        case 3: {
          const [a] = params
          if (!phaseUsed) {
            memory[a] = phase
            phaseUsed = true
          } else {
            if (input === undefined) {
              throw new Error('No input')
            }
            memory[a] = input
          }
          i += 2
          break
        }
        case 4: {
          const value = memory[params[0]]

          i += 2

          if (value !== 0) {
            output = value
            return { output, done: false }
          }

          break
        }
        case 5:
        case 6: {
          const [a, b] = mapParamsToMemory(params)

          let match: boolean
          if (op === 5) match = a !== 0
          else match = a === 0

          if (match) i = b
          else i += 3

          break
        }
        case 7:
        case 8: {
          const [a, b] = mapParamsToMemory(params)
          const c = params[2]

          let match: boolean
          if (op === 7) match = a < b
          else match = a === b

          if (match) memory[c] = 1
          else memory[c] = 0

          i += 4
          break
        }
        case 9: {
          const [a] = mapParamsToMemory(params)

          relativeBase += a

          i += 2
          break
        }
        case 99: {
          return { output, done: true }
        }
      }
    }
  }

  return run
}
