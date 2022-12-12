import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

// it ain't much, but it's honest work
const inputGrid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split('').map(Number))

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

const grid: Node[][] = []

for (let y = 0; y < inputGrid.length * 5; y++) {
  grid[y] = []

  for (let x = 0; x < inputGrid[0].length * 5; x++) {
    let initialValue =
      Math.floor(x / inputGrid.length) + Math.floor(y / inputGrid[0].length)

    initialValue += inputGrid[y % inputGrid.length][x % inputGrid[0].length]

    if (initialValue >= 10) initialValue -= 9

    grid[y].push({
      cost: initialValue,
      totalCost: Number.MAX_SAFE_INTEGER,
    } as Node)
  }
}
grid[0][0].totalCost = 0

const start: Coord = { x: 0, y: 0 }

const pq = new PriorityQueue([start, 0])

while (pq.length > 0) {
  const [coord] = pq.shift()!

  const node = grid[coord.y][coord.x]

  for (const { x, y } of getDirs(coord)) {
    if (isOutOfBounds(x, y, grid)) continue

    const newNode = grid[y][x]
    const newCost = node.totalCost + newNode.cost
    if (newCost < newNode.totalCost) {
      newNode.totalCost = newCost
      pq.push({ x, y }, newNode.totalCost)
    }
  }
}

console.log(grid.at(-1)!.at(-1)!.totalCost)
