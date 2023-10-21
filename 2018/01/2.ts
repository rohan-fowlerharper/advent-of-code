import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')
const values = lines.map((l) => parseInt(l))

const seen = new Set<number>()
let frequency = 0
let i = 0

while (!seen.has(frequency)) {
  seen.add(frequency)
  frequency += values[i]
  i = (i + 1) % values.length
}

console.log(frequency)
