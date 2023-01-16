import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

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

const generatePoints = (wire: typeof wireA) => {
  const points = new Map<string, number>()
  let x = 0
  let y = 0
  let steps = 0

  for (const [dir, len] of wire) {
    const [dx, dy] = dirs[dir]

    for (let i = 0; i < len; i++) {
      x += dx
      y += dy
      steps++
      points.set(`${x},${y}`, steps)
    }
  }

  return points
}

const pointsA = generatePoints(wireA)
const pointsB = generatePoints(wireB)

const intersections = [...pointsA.keys()].filter((p) => pointsB.has(p))

const min = intersections.reduce((min, p) => {
  const steps = pointsA.get(p)! + pointsB.get(p)!

  return Math.min(min, steps)
}, Infinity)

console.log(min)
