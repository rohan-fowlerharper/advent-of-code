import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]

const get = (x: number, y: number) => grid[y]?.[x] ?? undefined

const checkDirections = (x: number, y: number) => {
  let total = 0
  directions: for (const [dx, dy] of dirs) {
    let nx = x
    let ny = y
    for (const letter of 'MAS') {
      ny += dy
      nx += dx
      if (get(nx, ny) !== letter) {
        continue directions
      }
    }
    total++
  }

  return total
}

let total = 0
for (const [y, row] of grid.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === 'X') {
      total += checkDirections(x, y)
    }
  }
}

console.log(total)
