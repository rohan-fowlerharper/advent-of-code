import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Wire = typeof wireA
const [wireA, wireB] = input
  .trimEnd()
  .split('\n')
  .map((l) =>
    l
      .split(',')
      .map((s) => [s[0], Number(s.slice(1))] as ['U' | 'D' | 'L' | 'R', number])
  )

const dirs = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
}

type Point = [number, number]
type Points = Map<string, Point>

const generatePoints = (wire: Wire) => {
  const points: Points = new Map()
  let x = 0
  let y = 0

  for (const [dir, len] of wire) {
    const [dx, dy] = dirs[dir]

    for (let i = 0; i < len; i++) {
      x += dx
      y += dy

      points.set(`${x},${y}`, [x, y])
    }
  }

  return points
}

const intersection = (a: Points, b: Points): Points => {
  const result: Points = new Map()

  for (const [key, value] of a) {
    if (b.has(key)) {
      result.set(key, value)
    }
  }

  return result
}

const manhattan = ([x, y]: Point) => Math.abs(x) + Math.abs(y)

const pointsA = generatePoints(wireA)
const pointsB = generatePoints(wireB)

const intersections = intersection(pointsA, pointsB)

const min = [...intersections.values()].reduce(
  (min, p) => Math.min(min, manhattan(p)),
  Infinity
)

console.log(min)
