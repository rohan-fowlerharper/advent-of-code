import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const [rawRanges, rawYourTicket, rawNearbyTickets] = input
  .trimEnd()
  .split('\n\n')

const ranges = rawRanges.split('\n').map((r) => {
  const [name, ranges] = r.split(': ')
  const [a, b] = ranges.split(' or ').map((r) => {
    const [min, max] = r.split('-').map(Number)
    return { min, max }
  })

  return { name, a, b }
})

const nearbyTickets = rawNearbyTickets
  .split('\n')
  .slice(1)
  .map((n) => n.split(',').map(Number))

const myTicket = rawYourTicket.split('\n')[1].split(',').map(Number)

performance.mark('parsed')

const validTickets = nearbyTickets.filter((n) =>
  n.every((n) => {
    return (
      ranges.some((r) => n >= r.a.min && n <= r.a.max) ||
      ranges.some((r) => n >= r.b.min && n <= r.b.max)
    )
  })
)

const rotated = validTickets[0].map((_, i) => validTickets.map((n) => n[i]))

const possibleRanges = rotated.map((n) => {
  return new Set(
    ranges
      .filter((r) => {
        return n.every((n) => {
          return (
            (n >= r.a.min && n <= r.a.max) || (n >= r.b.min && n <= r.b.max)
          )
        })
      })
      .map((r) => r.name)
  )
})

const order = new Map<string, number>()
while (order.size < possibleRanges.length) {
  const [index, [name]] = possibleRanges
    .map((p, i) => [i, p] as const)
    .find(([_, p]) => p.size === 1)!

  order.set(name, index)

  possibleRanges.forEach((p) => p.delete(name))
}

const departureValues = [...order].filter(([name]) =>
  name.startsWith('departure')
)

const result = departureValues
  .map(([_, index]) => myTicket[index])
  .reduce((a, b) => a * b, 1)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('16.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('16.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
