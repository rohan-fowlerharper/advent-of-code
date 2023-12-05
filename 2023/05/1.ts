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

const applyMapping = (value: number, category: Category): number => {
  const currentMappings = maps.get(category)!

  for (const mapping of currentMappings) {
    if (value >= mapping.source && value <= mapping.source + mapping.range) {
      value = mapping.destination + value - mapping.source
      break
    }
  }

  const nextDestination = categories[categories.indexOf(category) + 1]
  if (!nextDestination) return value
  return applyMapping(value, nextDestination)
}

let lowestSeen = Infinity
for (const seed of seeds) {
  const result = applyMapping(seed, 'seed-to-soil')
  if (result < lowestSeen) {
    lowestSeen = result
  }
}

console.log(lowestSeen)
