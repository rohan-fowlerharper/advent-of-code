import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n').map(Number)

const calculateFuel = (mass: number) => {
  let total = 0
  let fuel = Math.floor(mass / 3) - 2

  while (fuel > 0) {
    total += fuel
    fuel = Math.floor(fuel / 3) - 2
  }

  return total
}

const result = lines.reduce((acc, n) => {
  return acc + calculateFuel(n)
}, 0)

console.log(result)
