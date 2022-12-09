import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const fishes = input.split(',').map(Number)

const buckets = Array.from({ length: 9 }, () => 0)
for (const fish of fishes) {
  buckets[fish]++
}

for (let i = 0; i < 256; i++) {
  const numToAdd = buckets[0]
  for (let j = 1; j < buckets.length; j++) {
    buckets[j - 1] = buckets[j]
  }
  buckets[8] = numToAdd
  buckets[6] += numToAdd
}

const total = buckets.reduce((a, b) => a + b, 0)
console.log(total)
