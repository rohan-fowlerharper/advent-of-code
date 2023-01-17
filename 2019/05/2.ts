import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().split('\n')[0].split(',').map(Number)

const extractModes = (instruction: string[], i: number) => {
  const [a, b, c] = instruction.slice(0, instruction.length - 2).reverse()

  return [
    a === '0' ? numbers[numbers[i + 1]] : numbers[i + 1],
    b === '0' ? numbers[numbers[i + 2]] : numbers[i + 2],
    c === '0' ? numbers[i + 3] : i + 3,
  ]
}

const INPUT_VALUE = 5

let i = 0
computer: while (true) {
  const instruction = numbers[i].toString().padStart(5, '0').split('')

  const op = Number(instruction.slice(-2, instruction.length).join(''))

  switch (op) {
    case 1:
    case 2: {
      const [a, b, c] = extractModes(instruction, i)

      if (op === 1) numbers[c] = a + b
      else if (op === 2) numbers[c] = a * b

      i += 4
      break
    }
    case 3: {
      numbers[numbers[i + 1]] = INPUT_VALUE
      i += 2
      break
    }
    case 4: {
      console.log(numbers[numbers[i + 1]])
      i += 2
      break
    }
    case 5: {
      const [a, b] = extractModes(instruction, i)

      if (a !== 0) i = b
      else i += 3
      break
    }
    case 6: {
      const [a, b] = extractModes(instruction, i)

      if (a === 0) i = b
      else i += 3
      break
    }
    case 7: {
      const [a, b, c] = extractModes(instruction, i)

      if (a < b) numbers[c] = 1
      else numbers[c] = 0

      i += 4
      break
    }
    case 8: {
      const [a, b, c] = extractModes(instruction, i)

      if (a === b) numbers[c] = 1
      else numbers[c] = 0

      i += 4
      break
    }
    case 99: {
      break computer
    }
  }
}
