import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [seedsRaw, ...mapsRaw] = input.trimEnd().split('\n\n')

const seeds = seedsRaw.split(': ')[1].split(' ').map(Number)

type Mapping = {
  source: number
  destination: number
  range: number
}
const maps = new Map<string, Mapping[]>()
for (const map of mapsRaw) {
  const [line1, ...mappingsRaw] = map.split('\n')
  const [name] = line1.split(' ')
  const [from, , to] = name.split('-')

  const mappings = mappingsRaw.map((mappingRaw) => {
    const [destination, source, range] = mappingRaw.split(' ').map(Number)
    return { source, destination, range }
  })

  maps.set(name, mappings)
}

const categories = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
] as const
type Category = (typeof categories)[number]

type Direction = 'forward' | 'reverse'
const applyMapping = (
  value: number,
  mapping: Category,
  direction: Direction = 'forward'
): number => {
  const from = direction === 'forward' ? 'source' : 'destination'
  const to = direction === 'forward' ? 'destination' : 'source'
  const nextDestination =
    direction === 'forward'
      ? categories[categories.indexOf(mapping) + 1]
      : categories[categories.indexOf(mapping) - 1]
  const currentMappings = maps.get(mapping)!

  for (const mapping of currentMappings) {
    if (value >= mapping[from] && value <= mapping[from] + mapping.range) {
      value = mapping[to] + value - mapping[from]
      break
    }
  }

  if (!nextDestination) {
    return value
  } else {
    return applyMapping(value, nextDestination, direction)
  }
}

const seedPairs: { start: number; range: number }[] = []
for (let i = 0; i < seeds.length; i += 2) {
  const start = seeds[i]
  const range = seeds[i + 1]

  seedPairs.push({ start, range })
}

const isValidSeed = (seed: number): boolean => {
  for (const { start, range } of seedPairs) {
    if (seed >= start && seed <= start + range) {
      return true
    }
  }

  return false
}

const locationMappings = maps.get('humidity-to-location')!
const locationDestinations = locationMappings.map((m) => m.destination)
const lowestLocation = Math.min(...locationDestinations)

let location = lowestLocation
while (true) {
  // slow but it works
  const seed = applyMapping(location, 'humidity-to-location', 'reverse')
  if (isValidSeed(seed)) {
    console.log(location)
    break
  }

  location++
}
