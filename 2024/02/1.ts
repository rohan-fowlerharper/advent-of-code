import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const MIN_DIFF = 1
const MAX_DIFF = 3

const answer = lines.filter((line) => {
  const numbers = line.split(' ').map(Number)
  return checkLine(numbers, 0)
}).length

console.log(answer)

function isLineIncreasing(numbers: number[]) {
  const increasingCount = numbers.filter((n, i) => n < numbers[i + 1]).length
  const decreasingCount = numbers.length - increasingCount - 1
  return increasingCount > decreasingCount
}

function getDiff(numbers: number[], index: number, increasing: boolean) {
  const current = numbers[index]
  const next = numbers[index + 1]

  const larger = increasing ? next : current
  const smaller = increasing ? current : next

  return larger - smaller
}

function isDiffValid(diff: number) {
  return diff >= MIN_DIFF && diff <= MAX_DIFF
}

function checkLine(numbers: number[], depth: number) {
  const lineIncreasing = isLineIncreasing(numbers)

  return numbers.every((_, i) => {
    if (i === numbers.length - 1) return true
    return isDiffValid(getDiff(numbers, i, lineIncreasing))
  })
}
