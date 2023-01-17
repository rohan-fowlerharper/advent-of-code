const extractValues = (instruction: string[], i: number, numbers: number[]) => {
  const modes = instruction.slice(0, instruction.length - 2).reverse()

  return [
    modes[0] === '0' ? numbers[numbers[i + 1]] : numbers[i + 1],
    modes[1] === '0' ? numbers[numbers[i + 2]] : numbers[i + 2],
    modes[2] === '0' ? numbers[i + 3] : i + 3,
  ]
}

export default function main(
  phase: number,
  ns: number[]
): (input: number) => [number, boolean] {
  let i = 0
  let phaseUsed = false
  let output = -1
  const numbers = [...ns]

  return (input) => {
    while (true) {
      const instruction = numbers[i].toString().padStart(5, '0').split('')

      const op = Number(instruction.slice(-2, instruction.length).join(''))

      switch (op) {
        case 1:
        case 2: {
          const [a, b, c] = extractValues(instruction, i, numbers)

          if (op === 1) numbers[c] = a + b
          else if (op === 2) numbers[c] = a * b

          i += 4
          break
        }
        case 3: {
          if (!phaseUsed) {
            numbers[numbers[i + 1]] = phase
            phaseUsed = true
          } else {
            numbers[numbers[i + 1]] = input
          }
          i += 2
          break
        }
        case 4: {
          const value = numbers[numbers[i + 1]]
          i += 2
          if (value !== 0) {
            output = value
            return [output, false]
          }

          break
        }
        case 5: {
          const [a, b] = extractValues(instruction, i, numbers)

          if (a !== 0) i = b
          else i += 3
          break
        }
        case 6: {
          const [a, b] = extractValues(instruction, i, numbers)

          if (a === 0) i = b
          else i += 3
          break
        }
        case 7: {
          const [a, b, c] = extractValues(instruction, i, numbers)

          if (a < b) numbers[c] = 1
          else numbers[c] = 0

          i += 4
          break
        }
        case 8: {
          const [a, b, c] = extractValues(instruction, i, numbers)

          if (a === b) numbers[c] = 1
          else numbers[c] = 0

          i += 4
          break
        }
        case 99: {
          return [output, true]
        }
      }
    }
  }
}
