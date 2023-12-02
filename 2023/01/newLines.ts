import { lines, numbersAsWords } from './2.ts'

// on each line, replace the first and last instance of a matching word
// with the number it represents
export const newLines = lines
  .map((line) => {
    let word = ''
    let newLine = line
    line1: for (const letter of line) {
      if (parseInt(letter)) {
        break
      }
      word += letter
      for (const [number, wordNumber] of Object.entries(numbersAsWords)) {
        // console.log(word, wordNumber)
        if (word.includes(wordNumber)) {
          console.log('replacing', word, 'with', number)
          newLine = newLine.replace(word, number)
          word = ''
          break line1
        }
      }
    }
    line2: for (const letter of line.split('').toReversed()) {
      if (parseInt(letter)) {
        break
      }
      word += letter
      for (const [number, wordNumber] of Object.entries(numbersAsWords)) {
        console.log(word.split('').toReversed().join(''), wordNumber)
        if (word.split('').toReversed().join('').includes(wordNumber)) {
          // console.log('replacing', word, 'with', number)
          newLine = newLine.replace(
            word.split('').toReversed().join(''),
            number
          )
          word = ''
          break line2
        }
      }
    }
    console.log(newLine)
    return newLine
  })
  .map((l) => {
    const result = l.split('').filter((v) => parseInt(v))
    const result2 = result.at(0) + result.at(-1)
    console.log(
      l,
      l.split('').filter((v) => parseInt(v)),
      result2
    )
    return l.split('').filter((v) => parseInt(v))
  })
  .map((l) => l.at(0) + l.at(-1))
  .map((l) => {
    return l
  })
  .map((v) => parseInt(v))
  .reduce((acc, val) => acc + val, 0)
