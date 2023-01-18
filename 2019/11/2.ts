import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createComputer from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const stream = input.trimEnd().replace('\n', '').split(',').map(Number)

type Coord = `${number},${number}`
type Point = { x: number; y: number }
const grid = new Set<Coord>()

const key = (p: Point): Coord => `${p.x},${p.y}`

const memory = [...stream]
const run = createComputer(memory)

const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
] as const

let facing = 0
const turn = (direction: number) => {
  if (direction === 0) facing = (facing + 3) % 4
  else if (direction === 1) facing = (facing + 1) % 4
}

let pos: Point = { x: 0, y: 0 }
grid.add(key(pos))

while (true) {
  const input = grid.has(key(pos)) ? 1 : 0

  const painting = run(input)

  if (painting.done) break

  if (painting.output === 1) {
    grid.add(key(pos))
  } else {
    grid.delete(key(pos))
  }

  const turning = run(input)

  if (turning.done) break

  turn(turning.output)

  pos = {
    x: pos.x + dirs[facing].x,
    y: pos.y + dirs[facing].y,
  }
}

const points = [...grid].map((c) => c.split(',').map(Number))
const [minX, maxX, minY, maxY] = points.reduce(
  ([minX, maxX, minY, maxY], [x, y]) => [
    Math.min(minX, x),
    Math.max(maxX, x),
    Math.min(minY, y),
    Math.max(maxY, y),
  ],
  [Infinity, -Infinity, Infinity, -Infinity]
)

const width = maxX - minX + 1
const height = maxY - minY + 1

const printed = Array.from({ length: height }, () => Array(width).fill(' '))

for (const [x, y] of points) {
  printed[y - minY][x - minX] = '█'
}

console.log(printed.map((row) => row.join('')).join('\n'))
