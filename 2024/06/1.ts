import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

type Point = { x: number; y: number }

const key = (point: Point) => `${point.x},${point.y}`

const blocks = new Set<string>()
const visited = new Set<string>()

const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
]

const pos: Point = { x: 0, y: 0 }
let dir = dirs[0]

for (const [y, row] of grid.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === '#') {
      blocks.add(key({ x, y }))
    }

    if (cell === '^') {
      pos.x = x
      pos.y = y
    }
  }
}

const isOutOfBounds = (point: Point) => {
  return (
    point.x < 0 ||
    point.y < 0 ||
    point.x >= grid[0].length ||
    point.y >= grid.length
  )
}

while (true) {
  visited.add(key(pos))
  let next = { x: pos.x + dir.x, y: pos.y + dir.y }

  while (blocks.has(key(next))) {
    dir = dirs[(dirs.indexOf(dir) + 1) % dirs.length]
    next = { x: pos.x + dir.x, y: pos.y + dir.y }
  }

  pos.x = next.x
  pos.y = next.y

  if (isOutOfBounds(next)) {
    break
  }
}

console.log(visited.size)
