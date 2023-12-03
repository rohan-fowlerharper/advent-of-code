import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

// coords of symbols 'x-y'
const symbolMap = new Map<string, string>()

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const char = lines[i][j]
    if (char !== '.' && isNaN(Number(char))) {
      const coord = `${j}-${i}`
      symbolMap.set(coord, char)
    }
  }
}

let partNumbers = new Map<string, Set<string>>()
let sum = 0
for (let row = 0; row < lines.length; row++) {
  let currentNumber = ''
  let currentNumberIndexStart = 0
  let currentNumberIndexEnd = 0
  for (let col = 0; col < lines[row].length; col++) {
    const char = lines[row][col]

    if (!isNaN(Number(char))) {
      if (currentNumber === '') {
        currentNumberIndexStart = col
      }
      currentNumber += char

      const nextChar = lines[row][col + 1]

      if (isNaN(Number(nextChar))) {
        currentNumberIndexEnd = col

        for (let i = row + 1; i >= row - 1; i--) {
          for (
            let j = currentNumberIndexEnd + 1;
            j >= currentNumberIndexStart - 1;
            j--
          ) {
            const coord = `${j}-${i}`
            if (partNumbers.has(coord)) {
              const set = partNumbers.get(coord)!
              set.add(currentNumber)
              partNumbers.set(coord, set)
            } else {
              partNumbers.set(coord, new Set([currentNumber]))
            }
          }
        }
        currentNumber = ''
        currentNumberIndexEnd = 0
        currentNumberIndexStart = 0
      }
    }
  }
}

for (const [coord, symbol] of symbolMap) {
  if (symbol === '*') {
    const set = partNumbers.get(coord)
    if (set && set.size === 2) {
      const [a, b] = set
      sum += Number(a) * Number(b)
    }
  }
}
console.log(sum)
