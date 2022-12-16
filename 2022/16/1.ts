import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { PriorityQueue } from 'npm:@datastructures-js/priority-queue@latest'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Valve = {
  name: string
  rate: number
  neighbours: { [name: string]: number }
}
const lines = input.trimEnd().split('\n')

const valves = new Map<string, Valve>()
for (const line of lines) {
  const [valve, rate, tunnels] = line
    .match(
      /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/
    )!
    .slice(1)

  const neighbours: Valve['neighbours'] = {}

  tunnels.split(', ').forEach((n) => {
    neighbours[n!] = 1
  })

  const n = Number(rate)

  const v = { name: valve, rate: n, neighbours }
  valves.set(valve, v)
}

// Add every node as a neighbour of each node
// As { [node]: distance }
for (const [name, valve] of valves) {
  const queue = new PriorityQueue<[string, number]>(
    (a, b) => {
      return a[1] - b[1]
    },
    [[name, 0]]
  )
  const visited = new Set<string>()

  while (!queue.isEmpty()) {
    const [current, distance] = queue.dequeue()!
    visited.add(current)

    if (current !== name)
      valve.neighbours[current] = Math.min(
        valve.neighbours[current] ?? Number.MAX_SAFE_INTEGER,
        distance
      )

    const currentValve = valves.get(current)!

    for (const neighbour in currentValve.neighbours) {
      if (
        visited.has(neighbour) ||
        neighbour === name ||
        currentValve.neighbours[neighbour] > 1
      )
        continue
      queue.enqueue([neighbour, distance + 1])
    }
  }
}

const AA = valves.get('AA')!

const operableValves = new Set<string>(
  Object.entries(AA.neighbours)
    .filter((v) => valves.get(v[0])!.rate > 0)
    .map((v) => v[0])
)

type Move = typeof startingCondition
const startingCondition = {
  name: 'AA',
  pressure: 0,
  movesLeft: 30,
  closed: new Set(operableValves),
  opened: new Set<string>(),
}

let queue: Move[] = [startingCondition]

const completedPaths: Move[] = []
const isMostPressure = (a: Move, b: Move) => (a.pressure > b.pressure ? a : b)

while (queue.length > 0) {
  const roundItems: Move[] = []

  for (const item of queue) {
    for (const nextName of item.closed) {
      const next = valves.get(nextName)!
      const distance = next.neighbours[item.name]

      const movesLeft = item.movesLeft - distance - 1
      const newBest = item.pressure + movesLeft * next.rate
      const newClosed = new Set(item.closed)
      const newOpened = new Set(item.opened)

      newClosed.delete(nextName)

      const nextMove = {
        name: nextName,
        pressure: newBest,
        movesLeft,
        closed: newClosed,
        opened: new Set([...newOpened, nextName]),
      }

      if (movesLeft < 0 || newClosed.size === 0) {
        completedPaths.push(nextMove)
        continue
      }

      roundItems.push(nextMove)
    }
  }

  const dedupedItems = new Map<string, Move[]>()
  for (const item of roundItems) {
    const key = `${item.name}-${[...item.opened].sort().join(',')}`

    const value = dedupedItems.get(key) || []

    value.push(item)
    dedupedItems.set(key, value)
  }

  const remaining = Array.from(dedupedItems.values()).map((items) =>
    items.reduce(isMostPressure)
  )

  // possibleRoutes.push(...remaining)
  queue = remaining
}

const found = completedPaths.reduce(isMostPressure)

if (found === null) throw new Error('No solution found')
console.log(found.pressure)
