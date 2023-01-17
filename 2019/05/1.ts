import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().split('\n')[0].split(',').map(Number)

const INPUT_VALUE = 5

let i = 0
computer: while (true) {
  const instruction = numbers[i].toString().padStart(5, '0').split('')

  const op = Number(instruction.slice(-2, instruction.length).join(''))

  switch (op) {
    case 1:
    case 2: {
      const [a, b, c] = instruction.slice(0, instruction.length - 2).reverse()

      const aVal = a === '0' ? numbers[numbers[i + 1]] : numbers[i + 1]
      const bVal = b === '0' ? numbers[numbers[i + 2]] : numbers[i + 2]
      const cVal = c === '0' ? numbers[i + 3] : i + 3

      if (op === 1) numbers[cVal] = aVal + bVal
      else if (op === 2) numbers[cVal] = aVal * bVal

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
    case 99: {
      break computer
    }
  }
}
