import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

console.log(input)

let max = 0
let currentElf = 0
for (const line of lines) {
  if (line === '') {
    if (currentElf > max) {
      max = currentElf
    }
    currentElf = 0
    continue
  }

  currentElf += parseInt(line)
}

console.log(max)
