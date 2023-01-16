import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().split('\n')[0].split('').map(Number)

const play = (numbers: number[], current: number): number => {
  const currentIdx = numbers.indexOf(current)
  const pickedUp = numbers.splice(currentIdx + 1, 3)
  if (pickedUp.length < 3) {
    pickedUp.push(...numbers.splice(0, 3 - pickedUp.length))
  }

  let destination = current - 1
  let destinationIndex = numbers.indexOf(destination)

  while (destinationIndex === -1) {
    destination--
    if (destination < Math.min(...numbers)) {
      destination = Math.max(...numbers)
    }
    destinationIndex = numbers.indexOf(destination)
  }

  numbers.splice(destinationIndex + 1, 0, ...pickedUp)

  const next = numbers[(numbers.indexOf(current) + 1) % numbers.length]
  return next
}

let next = numbers[0]
for (let i = 0; i < 100; i++) {
  next = play(numbers, next)
}

const oneIdx = numbers.indexOf(1)
const result = numbers
  .slice(oneIdx + 1)
  .concat(numbers.slice(0, oneIdx))
  .join('')

console.log(result)
