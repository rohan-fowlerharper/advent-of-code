import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const orbits = input
  .trimEnd()
  .split('\n')
  .map((line) => line.split(')') as [string, string])

const orbitMap = new Map<string, string[]>()

for (const [center, orbiter] of orbits) {
  if (orbitMap.has(center)) {
    orbitMap.get(center)!.push(orbiter)
  } else {
    orbitMap.set(center, [orbiter])
  }
}

const countOrbits = (center: string, depth: number): number => {
  const orbiters = orbitMap.get(center)!

  if (!orbiters) return depth

  return orbiters.reduce((total, orbiter) => {
    return total + countOrbits(orbiter, depth + 1)
  }, depth)
}

console.log(countOrbits('COM', 0))
