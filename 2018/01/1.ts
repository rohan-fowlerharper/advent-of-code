import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')
const value = lines.map((l) => parseInt(l)).reduce((a, b) => a + b, 0)

console.log(value)
