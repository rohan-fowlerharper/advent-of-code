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

for (const valve of valves.values()) {
  for (const n in valve.neighbours) {
    if (!operableValves.has(n)) {
      delete valve.neighbours[n]
    }
  }
}

type Path = typeof startingCondition
const startingCondition = {
  name: 'AA',
  pressure: 0,
  movesLeft: 30,
  closed: new Set(operableValves),
  opened: new Set<string>(),
}

let pool: Path[] = [startingCondition]

const paths: Path[] = []
const isMostPressure = (a: Path, b: Path) => (a.pressure > b.pressure ? a : b)
const generateKey = (p: Path) => `${p.name}-${[...p.opened].sort().join(',')}`

while (pool.length > 0) {
  const roundItems: Path[] = []

  for (const item of pool) {
    const valve = valves.get(item.name)!

    for (const nextName of item.closed) {
      const next = valves.get(nextName)!
      const distance = valve.neighbours[nextName]

      const movesLeft = item.movesLeft - distance - 1

      const newClosed = new Set(item.closed)
      newClosed.delete(nextName)

      if (movesLeft <= 0) {
        continue
      }

      roundItems.push({
        name: nextName,
        pressure: item.pressure + movesLeft * next.rate,
        movesLeft,
        closed: newClosed,
        opened: new Set([...item.opened, nextName]),
      })
    }
  }

  const pruned = new Map<string, Path>()
  for (const item of roundItems) {
    const key = generateKey(item)

    pruned.set(key, isMostPressure(item, pruned.get(key) ?? item))
  }

  paths.push(...pruned.values())
  pool = Array.from(pruned.values())
}

paths.sort((a, b) => b.pressure - a.pressure)

console.log(paths[0])
