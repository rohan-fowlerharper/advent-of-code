import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const orbits = input
  .trimEnd()
  .split('\n')
  .map((line) => line.split(')') as [string, string])

const orbitMap = new Map<string, Set<string>>()

for (const [center, orbiter] of orbits) {
  if (!orbitMap.has(center)) orbitMap.set(center, new Set())
  if (!orbitMap.has(orbiter)) orbitMap.set(orbiter, new Set())

  orbitMap.get(center)!.add(orbiter)
  orbitMap.get(orbiter)!.add(center)
}

const start = 'YOU'
const end = 'SAN'

const queue = [{ visited: new Set(), current: start }]

let pathLength = -1

while (queue.length > 0) {
  const { visited, current } = queue.shift()!
  const node = orbitMap.get(current)!

  for (const neighbour of node) {
    if (neighbour === end) {
      pathLength = visited.size
      break
    }

    if (visited.has(neighbour)) continue

    queue.push({
      visited: new Set([...visited, current]),
      current: neighbour,
    })
  }
}

console.log(pathLength)
