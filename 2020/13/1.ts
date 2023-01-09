import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const [earliestString, busesString] = input.trimEnd().split('\n')

const earliest = Number(earliestString)
const buses = busesString.split(',').map(Number).filter(Boolean)

performance.mark('parsed')

const waitTimes = buses.map((bus) => {
  const waitTime = bus - (earliest % bus)
  return { bus, waitTime }
})

waitTimes.sort((a, b) => a.waitTime - b.waitTime)
const { bus, waitTime } = waitTimes[0]
const result = bus * waitTime

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('13.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('13.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
