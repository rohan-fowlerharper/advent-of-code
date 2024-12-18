import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { PriorityQueue } from 'utils'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

type Point = { x: number; y: number }
type StackItem = Point

const key = (p: Point) => `${p.x},${p.y}`

const walls = new Set<string>()
const MAX_X = 70
const MAX_Y = 70

const dirs: Point[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
]

const isOutOfBounds = (p: Point) =>
  p.x < 0 || p.x > MAX_X || p.y < 0 || p.y > MAX_Y

const manhattan = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

for (let i = 0; i < 1024; i++) {
  walls.add(lines[i])
}

const start: Point = { x: 0, y: 0 }
const end: Point = { x: MAX_X, y: MAX_Y }

function canReachEnd(walls: Set<string>): boolean {
  const q = new PriorityQueue(
    [{ ...start }],
    (a, b) => manhattan(a, end) - manhattan(b, end)
  )
  const visited = new Set<string>(key(start))

  while (q.length) {
    const c = q.pop()!

    if (c.x === end.x && c.y === end.y) {
      return true
    }

    for (const d of dirs) {
      const next: Point = {
        x: c.x + d.x,
        y: c.y + d.y,
      }
      const k = key(next)
      if (isOutOfBounds(next) || visited.has(k) || walls.has(k)) {
        continue
      }

      visited.add(k)
      q.push(next)
    }
  }
  return false
}

const createWalls = (end: number) => new Set<string>(lines.slice(0, end))

let left = 1024
let right = lines.length

while (left <= right) {
  const mid = Math.floor((left + right) / 2)
  const walls = createWalls(mid)

  if (canReachEnd(walls)) {
    left = mid + 1
  } else {
    right = mid - 1
  }
}

console.log(lines[right])
