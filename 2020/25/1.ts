import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [cardKey, doorKey] = input.trimEnd().split('\n').map(Number)

const SUBJECT_NUMBER = 7
const DIVISOR = 20201227

const transform = (v: number, subjectNumber = SUBJECT_NUMBER) =>
  (v * subjectNumber) % DIVISOR

const findLoopSize = (key: number) => {
  let value = 1
  let loopSize = 0
  while (value !== key) {
    value = transform(value)
    loopSize++
  }
  return loopSize
}

const findEncryptionKey = (subjectNumber: number, loopSize: number) => {
  let value = 1
  for (let i = 0; i < loopSize; i++) {
    value = transform(value, subjectNumber)
  }
  return value
}

const doorLoopSize = findLoopSize(doorKey)
const encryptionKey = findEncryptionKey(cardKey, doorLoopSize)

console.log(encryptionKey)
