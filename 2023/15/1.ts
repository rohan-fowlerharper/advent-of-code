import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const values = input.trimEnd().split(',')

const hash = (value: string) => {
  let current = 0
  for (const char of value) {
    const ascii = char.charCodeAt(0)
    current += ascii
    current *= 17
    current %= 256
  }
  return current
}

const sum = values.reduce((sum, value) => sum + hash(value), 0)

console.log(sum)
