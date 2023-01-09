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
lines.unshift(0)

performance.mark('parsed')

const seen = new Map<number, number>()

function count(i: number): number {
  if (i === lines.length - 1) return 1

  if (seen.has(i)) return seen.get(i)!

  let sum = 0
  for (let j = i + 1; j < lines.length; j++) {
    if (lines[j] - lines[i] <= 3) {
      sum += count(j)
    }
  }

  seen.set(i, sum)

  return sum
}

const result = count(0)

console.log(result)

performance.mark('end')

console.log(
  `To parse: ${performance
    .measure('10.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('10.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
