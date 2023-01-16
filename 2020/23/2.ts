import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.replaceAll('\n', '').split('').map(Number)

for (let i = 10; i <= 1000000; i++) {
  numbers.push(i)
}

function solve(numbers: number[], steps: number) {
  const next = new Map<number, number>()
  const min = 1
  const max = numbers.length

  for (let i = 0; i < max - 1; i++) {
    next.set(numbers[i], numbers[i + 1])
  }
  next.set(numbers[max - 1], numbers[0])

  let current = numbers[0]
  for (let i = 0; i < steps; i++) {
    const c1 = next.get(current)!
    const c2 = next.get(c1)!
    const c3 = next.get(c2)!
    const c4 = next.get(c3)!

    next.set(current, c4)

    let destination = current - 1
    while (
      destination === c1 ||
      destination === c2 ||
      destination === c3 ||
      destination < min
    ) {
      destination--
      if (destination < min) {
        destination = max
      }
    }

    const d2 = next.get(destination)!
    next.set(destination, c1)
    next.set(c3, d2)

    current = next.get(current)!
  }

  return next
}

const next = solve(numbers, 10000000)

const c1 = next.get(1)!
const c2 = next.get(c1)!

const result = c1 * c2

console.log(result)
