import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

let total = 0
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const spot = Number(lines[i][j])
    const isLow = dirs.every(([x, y]) => {
      if (lines[i + y] === undefined || lines[i + y][j + x] === undefined) {
        return true
      }
      const char = Number(lines[i + y][j + x])
      return char > spot
    })
    if (isLow) {
      total += Number(spot) + 1
    }
  }
}
console.log(total)
