import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

let twos = 0
let threes = 0

for (const line of lines) {
  const counts = new Map<string, number>()

  for (const char of line) {
    const count = counts.get(char) ?? 0
    counts.set(char, count + 1)
  }

  const values = new Set(counts.values())
  if (values.has(2)) twos += 1
  if (values.has(3)) threes += 1
}

console.log(twos * threes)
