import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [a, b, letter, password] = l
      .match(/(\d+)-(\d+) (\w): (\w+)/)!
      .slice(1)
    return { a: Number(a), b: Number(b), letter, password }
  })

function xor(a: boolean, b: boolean) {
  return (a ? 1 : 0) ^ (b ? 1 : 0)
}

function isValid(a: number, b: number, password: string, letter: string) {
  return xor(
    password.charAt(a - 1) === letter,
    password.charAt(b - 1) === letter
  )
}

const valid = lines.filter(({ a, b, letter, password }) =>
  isValid(a, b, password, letter)
)

console.log(valid.length)
