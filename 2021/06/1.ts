import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const fishes = input.split(',').map(Number)

for (let i = 0; i < 80; i++) {
  let numToAdd = 0
  for (let j = 0; j < fishes.length; j++) {
    if (fishes[j] === 0) {
      numToAdd++
      fishes[j] = 6
    } else {
      fishes[j]--
    }
  }
  for (let j = 0; j < numToAdd; j++) {
    fishes.push(8)
  }
}

console.log(fishes.length)
