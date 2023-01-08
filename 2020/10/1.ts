import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input
  .trimEnd()
  .split('\n')
  .map(Number)
  .sort((a, b) => a - b)

lines.push(lines[lines.length - 1] + 3)

performance.mark('parsed')

const tally: Record<number, number> = {
  1: 0,
  3: 0,
}

lines.forEach((curr, i) => {
  const diff = curr - (lines[i - 1] ?? 0)
  tally[diff]++
})

const result = tally[1] * tally[3]

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('10.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('10.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
