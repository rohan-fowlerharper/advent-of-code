import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

type Point = { x: number; y: number }
type StackItem = Point & { distance: number }

const key = (p: Point) => `${p.x},${p.y}`

const walls = new Set<string>()

let MAX_X = 70
let MAX_Y = 70
for (const line of lines.slice(0, 1024)) {
  const [x, y] = line.split(',').map(Number)

  MAX_X = Math.max(MAX_X, x)
  MAX_Y = Math.max(MAX_Y, y)

  walls.add(line)
}

const start: Point = { x: 0, y: 0 }
const end: Point = { x: MAX_X, y: MAX_Y }

const dirs: Point[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
]

const isOutOfBounds = (p: Point) =>
  p.x < 0 || p.x > MAX_X || p.y < 0 || p.y > MAX_Y

const queue = [{ ...start, distance: 0 }]
const visited = new Set<string>(key(start))

while (queue.length) {
  const c = queue.shift()!

  if (c.x === end.x && c.y === end.y) {
    console.log(c.distance)
    break
  }

  for (const d of dirs) {
    const next: StackItem = {
      x: c.x + d.x,
      y: c.y + d.y,
      distance: c.distance + 1,
    }
    const k = key(next)
    if (isOutOfBounds(next) || visited.has(k) || walls.has(k)) {
      continue
    }

    visited.add(k)
    queue.push(next)
  }
}
