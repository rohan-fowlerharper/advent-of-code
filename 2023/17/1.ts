import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const heatLossGrid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split('').map(Number))

const get = (x: number, y: number): number | undefined => heatLossGrid[y]?.[x]

const N_MOVES_STRAIGHT_LINE = 3
type Point = {
  x: number
  y: number
  timesMovedStraight: number
  heatLoss: number
  direction: Direction
}
const stack: Point[] = [
  { x: 0, y: 0, timesMovedStraight: 0, heatLoss: 0, direction: 'right' },
  { x: 0, y: 0, timesMovedStraight: 0, heatLoss: 0, direction: 'down' },
]

const visited = new Map<string, number>()

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

const completedPaths = new Set<number>()

while (stack.length > 0) {
  const {
    x,
    y,
    timesMovedStraight,
    heatLoss: currentHeatLoss,
    direction,
  } = stack.shift()!

  const key = `${x},${y},${timesMovedStraight}`
  if (visited.has(key)) {
    const prevHeatLoss = visited.get(key)!
    if (currentHeatLoss >= prevHeatLoss) {
      continue
    }
  }

  if (isOutOfBounds(x, y)) {
    continue
  }

  if (isAtExit(x, y)) {
    completedPaths.add(currentHeatLoss)
    continue
  }

  visited.set(key, currentHeatLoss)

  // const heatLoss = get(x, y)!
  // console.log(heatLoss)

  // if we've moved straight 3 times, we must turn
  for (const dir of dirs) {
    const [dx, dy] = getDiff(dir)
    const nextX = x + dx
    const nextY = y + dy

    if (isOutOfBounds(nextX, nextY)) continue

    const nextHeatLoss = get(nextX, nextY)!
    const nextTimesMovedStraight =
      dir === direction ? timesMovedStraight + 1 : 1

    if (nextTimesMovedStraight > N_MOVES_STRAIGHT_LINE) continue

    stack.push({
      x: nextX,
      y: nextY,
      timesMovedStraight: nextTimesMovedStraight,
      heatLoss: currentHeatLoss + nextHeatLoss,
      direction: dir,
    })
  }
}

console.log(Math.min(...Array.from(completedPaths)))
