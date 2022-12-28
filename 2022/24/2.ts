import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { PriorityQueue } from 'npm:@datastructures-js/priority-queue@latest'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const grid = lines
  .map((l) => l.split('').filter((_, i) => i !== 0 && i !== l.length - 1))
  .filter((_, i, arr) => i !== 0 && i !== arr.length - 1)

const startX = lines[0].split('').findIndex((c) => c === '.')
const endX = lines
  .at(-1)!
  .split('')
  .findIndex((c) => c === '.')
type Point = {
  x: number
  y: number
}
type Turn = number
type Coord = `${number},${number}`
type Blizzard = Point & {
  direction: [number, number]
}
type Expedition = Point & {
  turn: number
}

const blizzards = new Map<string, Blizzard>()
for (const [y, line] of grid.entries()) {
  for (const [x, char] of line.entries()) {
    if (char === '.' || char === '#') continue

    const direction = ((): [number, number] => {
      switch (char) {
        case '>':
          return [1, 0]
        case '<':
          return [-1, 0]
        case '^':
          return [0, -1]
        case 'v':
          return [0, 1]
        default:
          throw new Error(`Unknown char: ${char}`)
      }
    })()
    blizzards.set(`${x},${y}`, {
      x,
      y,
      direction,
    })
  }
}

const key = (p: Point): Coord => `${p.x},${p.y}`

type Blizzards = Map<Coord, Blizzard>

const horizontalBlizzards: Blizzards = new Map()
const verticalBlizzards: Blizzards = new Map()
for (const blizzard of blizzards.values()) {
  const [dx] = blizzard.direction
  if (dx === 0) {
    verticalBlizzards.set(key(blizzard), blizzard)
  } else {
    horizontalBlizzards.set(key(blizzard), blizzard)
  }
}

const verticals = new Map<Turn, Blizzards>()
const height = grid.length
verticals.set(0, verticalBlizzards)
for (let i = 1; i < height; i++) {
  const nextBlizzards: Blizzards = new Map()
  for (const blizzard of verticalBlizzards.values()) {
    const { x, y, direction } = blizzard
    const [, dy] = direction
    const nextY = (y + dy * i + height) % height

    nextBlizzards.set(key({ x, y: nextY }), {
      ...blizzard,
      y: nextY,
    })
  }
  verticals.set(i, nextBlizzards)
}

const horizontals = new Map<Turn, Blizzards>()
const width = grid[0].length
horizontals.set(0, horizontalBlizzards)
for (let i = 1; i < width; i++) {
  const nextBlizzards = new Map<Coord, Blizzard>()
  for (const blizzard of horizontalBlizzards.values()) {
    const { x, y, direction } = blizzard
    const [dx] = direction
    const nextX = (x + dx * i + width) % width

    nextBlizzards.set(key({ x: nextX, y }), {
      ...blizzard,
      x: nextX,
    })
  }
  horizontals.set(i, nextBlizzards)
}

const getBlizzardLocations = (turn: number) => {
  const vertical = verticals.get(turn % verticals.size)!
  const horizontal = horizontals.get(turn % horizontals.size)!

  return { vertical, horizontal }
}

const hasBlizzard = (point: Point, turn: number) => {
  const { vertical, horizontal } = getBlizzardLocations(turn)
  return vertical.has(key(point)) || horizontal.has(key(point))
}

const _print = (turn: number, player?: Point) => {
  const { vertical, horizontal } = getBlizzardLocations(turn)
  const printGrid = grid.map((l) => l.map((_) => '.'))

  for (const { x, y } of vertical.values()) printGrid[y][x] = '#'
  for (const { x, y } of horizontal.values()) printGrid[y][x] = '#'

  if (player && printGrid[player.y]?.[player.x]) {
    const { x, y } = player
    printGrid[y][x] = printGrid[y][x] === '#' ? 'X' : 'O'
  }
  console.log('Minute', turn)
  console.log(printGrid.map((l) => l.join('')).join('\n'), '\n')
}

let start: Point = {
  x: startX - 1,
  y: -1,
}
let end: Point = {
  x: endX - 1,
  y: grid.length,
}

const queue = new PriorityQueue<Expedition>((a: Expedition, b: Expedition) => {
  const manhattan = (p: Point) => Math.abs(p.x - end.x) + Math.abs(p.y - end.y)
  return a.turn + manhattan(a) - (b.turn + manhattan(b))
})

queue.enqueue({ ...start, turn: 0 })

let visited = new Set<`${Turn},${Coord}`>()
let found = 0

while (!queue.isEmpty()) {
  const current = queue.dequeue()!

  if (visited.has(`${current.turn},${key(current)}`)) continue
  visited.add(`${current.turn},${key(current)}`)

  const { x, y } = current
  const nextPoints = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
    { x, y },
  ]

  for (const nextPoint of nextPoints) {
    const turn = current.turn + 1
    const next = { ...nextPoint, turn }
    if (next.x === end.x && next.y === end.y) {
      const tmp = end
      end = start
      start = tmp
      queue.clear()
      visited = new Set()

      queue.enqueue(next)
      found++
      if (found === 3) {
        console.log(turn)
        Deno.exit()
      }
      break
    }
    if (next.x === start.x && next.y === start.y) {
      queue.enqueue(next)
      continue
    }
    if (!grid[next.y]?.[next.x]) continue

    if (!hasBlizzard(next, turn)) {
      queue.enqueue(next)
    }
  }
}
