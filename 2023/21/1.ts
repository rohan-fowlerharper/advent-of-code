import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

type StringPoint = `${number},${number}`

let start: StringPoint = '0,0'
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'S') {
      start = `${x},${y}`
    }
  }
}

const STEPS_REQUIRED = 64

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

let batch = new Set<StringPoint>([start])
for (let steps = 1; steps <= STEPS_REQUIRED; steps++) {
  const nextBatch = new Set<StringPoint>()

  for (const item of batch) {
    const [x, y] = item.split(',').map(Number)
    for (const [dx, dy] of dirs) {
      const nx = x + dx
      const ny = y + dy

      const next = grid[ny][nx]
      if (next === '#') continue

      nextBatch.add(`${nx},${ny}`)
    }
  }

  batch = nextBatch
}

console.log(batch.size)
