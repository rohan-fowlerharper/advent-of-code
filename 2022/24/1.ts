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

const start: Point = {
  x: startX - 1,
  y: -1,
}
const end: Point = {
  x: endX - 1,
  y: grid.length,
}

type Blizzard = Point & {
  direction: [number, number]
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

const horizontalBlizzards = new Map<string, Blizzard>()
const verticalBlizzards = new Map<string, Blizzard>()
for (const blizzard of blizzards.values()) {
  if (blizzard.direction[0] === 0) {
    verticalBlizzards.set(key(blizzard), blizzard)
  } else {
    horizontalBlizzards.set(key(blizzard), blizzard)
  }
}

const allVerticalBlizzards = new Map<string, Map<string, Blizzard>>()
for (let i = 0; i < grid.length; i++) {
  const nextBlizzards = new Map<string, Blizzard>()
  for (const blizzard of verticalBlizzards.values()) {
    const { x, y } = blizzard
    const [, dy] = blizzard.direction
    let nextY = (y + dy * i) % grid.length
    if (nextY < 0) nextY += grid.length

    nextBlizzards.set(`${x},${nextY}`, {
      ...blizzard,
      y: nextY,
    })
  }
  allVerticalBlizzards.set(`${i}`, nextBlizzards)
}

const allHorizontalBlizzards = new Map<string, Map<string, Blizzard>>()
allHorizontalBlizzards.set('0', horizontalBlizzards)
for (let i = 0; i < grid[0].length; i++) {
  const nextBlizzards = new Map<string, Blizzard>()
  for (const blizzard of horizontalBlizzards.values()) {
    const { x, y } = blizzard
    const [dx] = blizzard.direction
    let nextX = (x + dx * i) % grid[0].length
    if (nextX < 0) nextX += grid[0].length

    nextBlizzards.set(`${nextX},${y}`, {
      ...blizzard,
      x: nextX,
    })
  }
  allHorizontalBlizzards.set(`${i}`, nextBlizzards)
}

const getBlizzardLocations = (turn: number) => {
  const verticalBlizzards = allVerticalBlizzards.get(
    `${turn % allVerticalBlizzards.size}`
  )
  const horizontalBlizzards = allHorizontalBlizzards.get(
    `${turn % allHorizontalBlizzards.size}`
  )
  return { verticalBlizzards, horizontalBlizzards }
}

const hasBlizzard = (point: Point, turn: number) => {
  const { verticalBlizzards, horizontalBlizzards } = getBlizzardLocations(turn)
  return (
    verticalBlizzards?.has(key(point)) || horizontalBlizzards?.has(key(point))
  )
}

const _printBlizzard = (turn: number, player?: Point) => {
  const { verticalBlizzards, horizontalBlizzards } = getBlizzardLocations(turn)
  const gridCopy = grid.map((l) => l.map((_) => '.'))
  for (const blizzard of verticalBlizzards?.values() ?? []) {
    gridCopy[blizzard.y][blizzard.x] = '#'
  }
  for (const blizzard of horizontalBlizzards?.values() ?? []) {
    gridCopy[blizzard.y][blizzard.x] = '#'
  }
  if (player && gridCopy[player.y]?.[player.x]) {
    if (gridCopy[player.y][player.x] === '#') {
      gridCopy[player.y][player.x] = 'X'
    } else {
      gridCopy[player.y][player.x] = 'O'
    }
  }
  console.log('Minute', turn)
  console.log(gridCopy.map((l) => l.join('')).join('\n'), '\n')
}

type Expedition = Point & {
  turn: number
}
const queue = new PriorityQueue((a: Expedition, b: Expedition) => {
  const distance = (p: Point) => Math.abs(p.x - end.x) + Math.abs(p.y - end.y)
  return a.turn - b.turn || distance(a) - distance(b)
})

queue.push({ ...start, turn: 0 })
type Turn = number
type Coord = `${number},${number}`
const visited = new Map<Turn, Set<Coord>>() // key: turn, value: visited points

while (!queue.isEmpty()) {
  const current = queue.dequeue()!

  if (visited.has(current.turn)) {
    const visitedPoints = visited.get(current.turn)!
    if (visitedPoints.has(key(current))) continue
    visitedPoints.add(key(current))
  } else {
    visited.set(current.turn, new Set([key(current)]))
  }

  const { x, y } = current
  const nextPoints = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]
  let waiting = false
  for (const nextPoint of nextPoints) {
    const turn = current.turn + 1
    const next = { ...nextPoint, turn }
    if (next.x === end.x && next.y === end.y) {
      console.log(next.turn)
      Deno.exit()
    }
    if (!grid[next.y]?.[next.x]) {
      if (next.x === start.x && next.y === start.y) queue.enqueue(next)

      continue
    }

    if (!hasBlizzard(next, turn)) {
      queue.enqueue(next)
      continue
    }
    if (waiting || hasBlizzard(current, turn)) {
      continue
    }

    queue.enqueue({ ...current, turn })
    waiting = true
  }
}
