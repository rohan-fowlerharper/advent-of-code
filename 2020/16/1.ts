import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const [rawRanges, _, rawNearbyRanges] = input.trimEnd().split('\n\n')

const valid = rawRanges
  .split('\n')
  .map((r) => r.split(': ')[1])
  .map((r) => r.split(' or '))
  .flat()
  .map((r) => {
    const [min, max] = r.split('-').map(Number)
    return { min, max }
  })

const values = rawNearbyRanges
  .split('\n')
  .slice(1)
  .map((n) => n.split(',').map(Number))
  .flat()

performance.mark('parsed')

const result = values
  .filter((n) => !valid.some((v) => n >= v.min && n <= v.max))
  .reduce((a, b) => a + b, 0)

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
