import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

let cycles = 1
let X = 1
const strengths: number[] = []

const cycle = () => {
  cycles++
  switch (cycles) {
    case 20:
    case 60:
    case 100:
    case 140:
    case 180:
    case 220:
      strengths.push(cycles * X)
  }
}

for (const line of lines) {
  cycle()

  if (line === 'noop') continue
  X += Number(line.split(' ')[1])

  cycle()
}

console.log(strengths.reduce((a, b) => a + b, 0))
