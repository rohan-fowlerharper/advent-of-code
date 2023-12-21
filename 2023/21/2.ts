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

const BOUNDS = {
  minX: 0,
  maxX: grid[0].length - 1,
  minY: 0,
  maxY: grid.length - 1,
}
const GRID_SIZE = grid.length
const DISTANCE_FROM_START_TO_EDGE = Number(start.split(',')[0])

const STEPS_REQUIRED = 3 * GRID_SIZE - DISTANCE_FROM_START_TO_EDGE - 1

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

const variables: number[] = []
let batch = new Set<StringPoint>([start])

for (let steps = 1; steps <= STEPS_REQUIRED; steps++) {
  const nextBatch = new Set<StringPoint>()

  for (const item of batch) {
    const [x, y] = item.split(',').map(Number)
    for (const [dx, dy] of dirs) {
      const nx = x + dx
      const ny = y + dy

      const next = grid[mod(ny, BOUNDS.maxY + 1)][mod(nx, BOUNDS.maxX + 1)]
      if (next === '#') continue

      nextBatch.add(`${nx},${ny}`)
    }
  }

  batch = nextBatch
  if (steps % GRID_SIZE === DISTANCE_FROM_START_TO_EDGE) {
    console.log(steps, batch.size)
    variables.push(batch.size)
  }
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

// const variables = [3821, 34234, 94963]
const [a, b, c] = variables
const quadratic = (x: number) => {
  return a + (b - a) * x + (x * (x - 1) * (a + c - b - b)) / 2
}

const REQUIRED_STEPS = 26501365
const N = (REQUIRED_STEPS - DISTANCE_FROM_START_TO_EDGE) / GRID_SIZE

console.log(quadratic(N))
