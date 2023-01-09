import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [min, max, letter, password] = l
      .match(/(\d+)-(\d+) (\w): (\w+)/)!
      .slice(1)
    return { min: Number(min), max: Number(max), letter, password }
  })

performance.mark('parsed')

function isValid(min: number, max: number, password: string, letter: string) {
  const count = password.split('').filter((l) => l === letter).length
  return count >= min && count <= max
}

const valid = lines.filter(({ min, max, letter, password }) =>
  isValid(min, max, password, letter)
)

performance.mark('end')

console.log(valid.length)

console.log(
  `To parse: ${performance
    .measure('02.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('02.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
