import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

let stones = input.trimEnd().split(' ').map(Number)

const STEPS = 25

for (let i = 0; i < STEPS; i++) {
  const newStones = [...stones]

  let newI = 0
  for (let j = 0; j < stones.length; j++, newI++) {
    const stone = stones[j]
    const stoneStr = String(stone)

    if (stone === 0) {
      newStones[newI] = 1
    } else if (stoneStr.length % 2 === 0) {
      const half = stoneStr.length / 2
      const left = Number(stoneStr.slice(0, half))
      const right = Number(stoneStr.slice(half))
      newStones[newI] = left
      newStones[newI + 1] = right
      newI++
    } else {
      newStones[newI] = stone * 2024
    }
  }

  stones = newStones
}

console.log(stones.length)
