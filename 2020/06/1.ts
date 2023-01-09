import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const groups = input
  .trimEnd()
  .split('\n\n')
  .map((g) => g.split('\n').map((l) => l.split('')))

performance.mark('parsed')

const answer = groups.reduce((total, group) => {
  const allAnswers = group.flat()
  const uniqueAnswers = new Set(allAnswers)

  return total + uniqueAnswers.size
}, 0)

performance.mark('end')

console.log(answer)

console.log(
  `To parse: ${performance
    .measure('06.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('06.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
