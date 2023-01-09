import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const busesString = input.trimEnd().split('\n')[1]

const buses: Array<{ bus: number; offset: number }> = []
busesString.split(',').forEach((time, offset) => {
  if (time === 'x') return null
  const bus = Number(time)
  buses.push({ bus, offset: offset % bus })
})

performance.mark('parsed')

const lcm = buses.reduce((product, { bus }) => product * bus, 1)

const others = buses.map(({ bus }) => lcm / bus)

const inv = buses.map(({ bus }, i) => {
  let x = 1

  while ((x * others[i]) % bus !== 1) {
    x++
  }

  return x
})

const result = buses.reduce((sum, { bus, offset }, i) => {
  let times = (bus - offset) * inv[i]

  while (times--) {
    sum = (sum + others[i]) % lcm
  }

  return sum
}, 0)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('13.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('13.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
