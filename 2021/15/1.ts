import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)
const lines = input.trimEnd().split('\n')

type Coord = { x: number; y: number }
type Node = { cost: number; totalCost: number }

const isOutOfBounds = (x: number, y: number, grid: unknown[][]) =>
  x < 0 || y < 0 || x >= grid[0].length || y >= grid.length

const dirs: { x: number; y: number }[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
]

const _string = ({ x, y }: { x: number; y: number }) => `${x},${y}`

const getDirs = ({ x, y }: Coord) =>
  dirs.map((dir) => ({
    x: x + dir.x,
    y: y + dir.y,
  }))

type QueueItem = [Coord, number]
class PriorityQueue {
  private q: QueueItem[]

  constructor(...initialItems: QueueItem[]) {
    this.q = initialItems ?? []
  }

  push(point: Coord, priority: number) {
    this.q.push([point, priority])
    this.q.sort(([, a], [, b]) => a - b)
  }

  shift() {
    return this.q.shift()
  }

  get length() {
    return this.q.length
  }
}

const grid = lines.map((l) =>
  l.split('').map(
    (n) =>
      ({
        cost: Number(n),
        totalCost: Number.MAX_SAFE_INTEGER,
      } as Node)
  )
)
grid[0][0].totalCost = 0

const start: Coord = { x: 0, y: 0 }

const pq = new PriorityQueue([start, 0])
const visited = new Set<string>()

while (pq.length > 0) {
  const [coord] = pq.shift()!
  if (visited.has(_string(coord))) continue

  const node = grid[coord.y][coord.x]

  for (const { x, y } of getDirs(coord)) {
    if (isOutOfBounds(x, y, grid)) continue

    const newNode = grid[y][x]
    const newCost = node.totalCost + newNode.cost
    if (newCost < newNode.totalCost) {
      newNode.totalCost = newCost
    }

    pq.push({ x, y }, newNode.totalCost)
  }

  visited.add(_string(coord))
}

console.log(grid.at(-1)!.at(-1)!.totalCost)
