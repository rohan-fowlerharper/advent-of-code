import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

let total = 0
for (const line of lines) {
  if (line === '') continue
  const length = line.length

  const firstHalf = line.slice(0, length / 2)
  const secondHalf = line.slice(length / 2)

  let commonLetter = ''
  for (const letter of firstHalf) {
    if (secondHalf.includes(letter)) {
      commonLetter = letter
      break
    }
  }

  const priority = alphabet.indexOf(commonLetter) + 1

  total += priority
}

console.log(total)
