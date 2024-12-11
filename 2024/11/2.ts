import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

// order of the current stones doesn't matter when determing the number of stones after x steps, so evaluate them as a map, reducing the sample space
let stones = new Map<number, number>()
input
  .trimEnd()
  .split(' ')
  .map(Number)
  .forEach((stone) => {
    stones.set(stone, (stones.get(stone) ?? 0) + 1)
  })

const STEPS = 75

for (let i = 0; i < STEPS; i++) {
  const newStones = new Map<number, number>()

  for (const [stone, value] of stones) {
    if (stone === 0) {
      newStones.set(1, (newStones.get(1) ?? 0) + value)
      continue
    }

    if (stone.toString().length % 2 === 0) {
      const stoneStr = stone.toString()
      const half = stoneStr.length / 2
      const left = Number(stoneStr.slice(0, half))
      const right = Number(stoneStr.slice(half))
      newStones.set(left, (newStones.get(left) ?? 0) + value)
      newStones.set(right, (newStones.get(right) ?? 0) + value)
      continue
    }

    newStones.set(stone * 2024, (newStones.get(stone * 2024) ?? 0) + value)
  }

  stones = newStones
}

console.log(Array.from(stones.values()).reduce((a, b) => a + b, 0))
