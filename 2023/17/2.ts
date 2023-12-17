import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import TinyQueue from 'npm:tinyqueue'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const heatLossGrid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split('').map(Number))

const get = (x: number, y: number): number | undefined => heatLossGrid[y]?.[x]

const N_MOVES_STRAIGHT_LINE = 10
const N_MOVES_STRAIGHT_LINE_MIN = 4
type Point = {
  x: number
  y: number
  timesMovedStraight: number
  heatLoss: number
  direction: Direction
  priority: number
}

const tq = new TinyQueue<Point>(
  [
    {
      x: 0,
      y: 0,
      timesMovedStraight: 0,
      heatLoss: 0,
      direction: 'right',
      priority: 0,
    },
    {
      x: 0,
      y: 0,
      timesMovedStraight: 0,
      heatLoss: 0,
      direction: 'down',
      priority: 0,
    },
  ],
  (a: Point, b: Point) => a.priority - b.priority
) as Point[]
const visited = new Map<
  string,
  { heatLoss: number; timesMovedStraight: number }
>()

type Direction = 'up' | 'down' | 'left' | 'right'

const getDiff = (dir: Direction): [number, number] => {
  switch (dir) {
    case 'up':
      return [0, -1]
    case 'down':
      return [0, 1]
    case 'left':
      return [-1, 0]
    case 'right':
      return [1, 0]
  }
}

const dirs = ['up', 'down', 'left', 'right'] as const

const BOUNDS = {
  minX: 0,
  maxX: heatLossGrid[0].length - 1,
  minY: 0,
  maxY: heatLossGrid.length - 1,
}

const isOutOfBounds = (x: number, y: number) =>
  x < BOUNDS.minX || x > BOUNDS.maxX || y < BOUNDS.minY || y > BOUNDS.maxY
const isAtExit = (x: number, y: number) =>
  x === BOUNDS.maxX && y === BOUNDS.maxY
const getOppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case 'up':
      return 'down'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
  }
}

const completedPaths = new Set<number>()

while (tq.length > 0) {
  const c = tq.pop()!

  const key = `${c.x},${c.y},${c.timesMovedStraight},${c.direction}`
  if (visited.has(key)) {
    const { heatLoss, timesMovedStraight } = visited.get(key)!
    if (c.timesMovedStraight === timesMovedStraight) {
      if (c.heatLoss >= heatLoss) {
        continue
      }
    }
    if (c.heatLoss === heatLoss) {
      if (c.timesMovedStraight >= timesMovedStraight) {
        continue
      }
    }
  }

  if (isOutOfBounds(c.x, c.y)) {
    continue
  }

  if (isAtExit(c.x, c.y)) {
    // completedPaths.add(c.heatLoss)
    if (c.timesMovedStraight >= N_MOVES_STRAIGHT_LINE_MIN) {
      completedPaths.add(c.heatLoss)
    }

    continue
  }

  visited.set(key, {
    heatLoss: c.heatLoss,
    timesMovedStraight: c.timesMovedStraight,
  })

  for (const dir of dirs) {
    if (dir === getOppositeDirection(c.direction)) continue
    const [dx, dy] = getDiff(dir)
    const nextX = c.x + dx
    const nextY = c.y + dy
    const nextTimesMovedStraight =
      dir === c.direction ? c.timesMovedStraight + 1 : 1
    if (nextTimesMovedStraight > N_MOVES_STRAIGHT_LINE) continue

    if (
      c.timesMovedStraight < N_MOVES_STRAIGHT_LINE_MIN &&
      dir !== c.direction
    ) {
      continue
    }

    const nextHeatLoss = get(nextX, nextY)! + c.heatLoss

    tq.push({
      x: nextX,
      y: nextY,
      timesMovedStraight: nextTimesMovedStraight,
      heatLoss: nextHeatLoss,
      direction: dir,
      priority:
        nextHeatLoss +
        nextTimesMovedStraight +
        Math.abs(nextX - BOUNDS.maxX) +
        Math.abs(nextY - BOUNDS.maxY),
    })
  }
}

console.log(Math.min(...Array.from(completedPaths)))
