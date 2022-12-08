import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.split(',').map(Number)
const min = Math.min(...numbers)
const max = Math.max(...numbers)

let minimum = Infinity
for (let i = min; i <= max; i++) {
  const totalFuelSpent = numbers.reduce((acc, pos) => {
    let fuel = Math.abs(pos - i)
    const initialFuel = fuel
    // lol @ this
    for (let j = 0; j < initialFuel; j++) {
      fuel += j
    }
    return acc + fuel
  }, 0)

  if (totalFuelSpent < minimum) {
    minimum = totalFuelSpent
  }
}

console.log(minimum)
