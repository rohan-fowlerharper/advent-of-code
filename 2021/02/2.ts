import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const start = [0, 0]
let aim = 0

for (const line of lines) {
  const [direction, distance] = line.split(' ')

  switch (direction) {
    case 'up':
      aim -= Number(distance)
      break
    case 'down':
      aim += Number(distance)
      break
    case 'forward':
      start[0] += Number(distance)
      start[1] += aim * Number(distance)
      break
  }
}

console.log(Math.abs(start[0] * start[1]))
