import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbersAsWords = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
}

const lines = input.trimEnd().split('\n')

// on each line, replace the first and last instance of a matching word
// with the number it represents
const newLines = lines
  .map((line) => {
    let newLine = line
    let word = ''
    line1: for (const letter of line) {
      if (parseInt(letter)) break

      word += letter
      for (const [number, wordNumber] of Object.entries(numbersAsWords)) {
        if (word.includes(wordNumber)) {
          newLine = newLine.replace(word, number + word)
          break line1
        }
      }
    }

    word = ''
    line2: for (const letter of line.split('').toReversed()) {
      if (parseInt(letter)) break line2

      word = letter + word
      for (const [number, wordNumber] of Object.entries(numbersAsWords)) {
        if (word.includes(wordNumber)) {
          // using regex, replace the last instance of the word with the number
          newLine = newLine

          // newLine = newLine.split('').toReversed().join('')
          // newLine = newLine.replace(
          //   word.split('').toReversed().join(''),
          //   number + word
          // )
          // newLine = newLine.split('').toReversed().join('')

          word = ''
          break line2
        }
      }
    }
    return newLine
  })
  .map((l) => l.split('').filter((v) => parseInt(v)))
  .map((l) => parseInt(l[0] + l.at(-1)))
  .reduce((acc, val) => acc + val, 0)

console.log(newLines)
console.log(!!parseInt(''))
