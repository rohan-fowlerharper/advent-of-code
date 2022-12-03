import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

let total = 0
for (let i = 0; i < lines.length; i += 3) {
  if (lines[i] === '') continue
  const [group1, group2, group3] = [lines[i], lines[i + 1], lines[i + 2]]

  let commonLetter = ''
  for (const letter of group1) {
    if (group2.includes(letter) && group3.includes(letter)) {
      commonLetter = letter
      break
    }
  }

  const priority = alphabet.indexOf(commonLetter) + 1
  total += priority
}

console.log(total)
