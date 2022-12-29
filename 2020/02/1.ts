import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [min, max, letter, password] = l
      .match(/(\d+)-(\d+) (\w): (\w+)/)!
      .slice(1)
    return { min: Number(min), max: Number(max), letter, password }
  })

function isValid(min: number, max: number, password: string, letter: string) {
  const count = password.split('').filter((l) => l === letter).length
  return count >= min && count <= max
}

const valid = lines.filter(({ min, max, letter, password }) =>
  isValid(min, max, password, letter)
)

console.log(valid.length)
