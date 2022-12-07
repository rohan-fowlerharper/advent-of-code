import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const start = [0, 0]

for (const line of lines) {
  const [direction, distance] = line.split(' ')

  switch (direction) {
    case 'up':
      start[1] += Number(distance)
      break
    case 'down':
      start[1] -= Number(distance)
      break
    case 'forward':
      start[0] += Number(distance)
      break
  }
}

console.log(Math.abs(start[0] * start[1]))
