import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

type Point = { x: number; y: number }

const dirs: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
]
const dirKeys = ['^', '>', 'V', '<']
const keyDirection = (dir: Point) => dirKeys[dirs.indexOf(dir)]
const key = (point: Point) => `${point.x},${point.y}`
const dkey = (point: Point, dir: Point) => `${key(point)}:${keyDirection(dir)}`

const blocks = new Set<string>()
const visited = new Set<string>()

let pos: Point = { x: 0, y: 0 }
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

const nextDir = (dir: Point) => {
  return dirs[(dirs.indexOf(dir) + 1) % dirs.length]
}

const nextPos = (pos: Point, dir: Point) => ({
  x: pos.x + dir.x,
  y: pos.y + dir.y,
})

let loopCount = 0

while (true) {
  visited.add(key(pos))

  let next = nextPos(pos, dir)

  if (isOutOfBounds(next)) {
    break
  }

  while (blocks.has(key(next))) {
    dir = nextDir(dir)
    next = nextPos(pos, dir)
  }

  if (!visited.has(key(next))) {
    let inner_pos = pos
    let inner_dir = dir
    const inner_blocks = new Set([...blocks, key(next)])
    const inner_visited = new Set<string>([dkey(next, dir)])

    while (true) {
      let next = nextPos(inner_pos, inner_dir)

      if (isOutOfBounds(next)) {
        break
      }

      while (inner_blocks.has(key(next))) {
        inner_dir = nextDir(inner_dir)
        next = nextPos(inner_pos, inner_dir)
      }

      if (inner_visited.has(dkey(next, inner_dir))) {
        loopCount++
        break
      }

      inner_visited.add(dkey(next, inner_dir))

      inner_pos = next
    }
  }

  pos = next
}

console.log(loopCount)
