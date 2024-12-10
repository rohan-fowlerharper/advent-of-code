import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split('').map(Number))

type Point = { x: number; y: number }

const key = ({ x, y }: Point) => `${x},${y}`
const dirs: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

const isOutOfBounds = (p: Point) =>
  p.x < 0 || p.y < 0 || p.y >= grid.length || p.x >= grid[0].length

const getNeighbors = (p: Point) =>
  dirs
    .map((d) => ({ x: p.x + d.x, y: p.y + d.y }))
    .filter((p) => !isOutOfBounds(p))

const get = (p: Point) => grid[p.y]?.[p.x]

const zeros: Point[] = []
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === 0) {
      zeros.push({ x, y })
    }
  }
}

const scores: number[] = []
for (const z of zeros) {
  let score = 0
  const visited = new Set<string>()
  const queue: [Point, number][] = [[z, 0]]
  while (queue.length > 0) {
    const [p, d] = queue.shift()!
    if (visited.has(key(p))) {
      continue
    }
    visited.add(key(p))

    if (get(p) === 9) {
      score++
    }

    for (const np of getNeighbors(p)) {
      if (get(np) === d + 1) {
        queue.push([np, d + 1])
      }
    }
  }

  scores.push(score)
}

console.log(scores.reduce((a, b) => a + b, 0))
