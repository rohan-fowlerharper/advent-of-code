import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Point = { x: number; y: number }
const dirs: Point[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
]
const key = (p: Point) => `${p.x},${p.y}`
const pKey = (s: StackItem) => `${s.x},${s.y},${s.dir.x},${s.dir.y}`

const getNextPoints = (dir: Point) => {
  const idx = dirs.findIndex((d) => d === dir)
  return [
    [1, dir],
    [1001, dirs[(idx + 1) % dirs.length]],
    [1001, dirs[(idx + 3) % dirs.length]],
  ] as const
}

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

const walls = new Set<string>()
const start: Point = { x: 0, y: 0 }
const end: Point = { x: 0, y: 0 }

for (const [y, row] of grid.entries()) {
  for (const [x, cell] of row.entries()) {
    if (cell === '#') {
      walls.add(key({ x, y }))
    }

    if (cell === 'S') {
      start.x = x
      start.y = y
    }

    if (cell === 'E') {
      end.x = x
      end.y = y
    }
  }
}

type StackItem = Point & { dir: Point; score: number; tiles: Set<string> }

const queue: StackItem[] = [
  {
    x: start.x,
    y: start.y,
    dir: dirs[0],
    score: 0,
    tiles: new Set<string>([key(start)]),
  },
]
const visited = new Map<string, number>()
const solutions: { score: number; tiles: Set<string> }[] = []
while (queue.length) {
  const c = queue.shift()!

  if (key(c) === key(end)) {
    solutions.push(c)
    continue
  }

  for (const [cost, d] of getNextPoints(c.dir)) {
    const next: StackItem = {
      x: c.x + d.x,
      y: c.y + d.y,
      dir: d,
      score: c.score + cost,
      tiles: new Set<string>(c.tiles),
    }
    next.tiles.add(key({ x: next.x, y: next.y }))

    if (walls.has(key(next))) {
      continue
    }

    if (visited.has(pKey(next)) && visited.get(pKey(next))! < next.score) {
      continue
    }

    visited.set(pKey(next), next.score)
    queue.push(next)
  }
}

function _printGrid(s: StackItem) {
  const g = [...grid.map((r) => [...r])]
  g[s.y][s.x] = 'X'
  s.tiles.forEach((t) => {
    const [x, y] = t.split(',').map(Number)
    g[y][x] = 'O'
  })
  console.log(g.map((r) => r.join('')).join('\n'))
}

const minScore = solutions.find(
  (s) => s.score === Math.min(...solutions.map((s) => s.score))
)

const solutionsWithMinScore = solutions.filter(
  (s) => s.score === minScore?.score
)

const allTilesOnMinScorePaths = new Set<string>()

solutionsWithMinScore.forEach((s) => {
  s.tiles.forEach((t) => allTilesOnMinScorePaths.add(t))
})

console.log(allTilesOnMinScorePaths.size)
