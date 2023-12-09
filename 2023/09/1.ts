import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(' ').map(Number))
// .map((l) => l.split(' ').map(Number).toReversed())
// ^ for part 2

const generateRow = (row: number[]) => {
  const newRow = []
  for (let i = 0; i < row.length - 1; i++) {
    newRow.push(row[i + 1] - row[i])
  }
  return newRow
}

const isAllZero = (row: number[]) => row.every((n) => n === 0)

const scores = lines.map((history) => {
  const pyramid: number[][] = [[...history]]

  let row = pyramid[0]
  while (true) {
    const nextRow = generateRow(row)
    pyramid.push(nextRow)

    if (isAllZero(nextRow)) {
      break
    }

    row = nextRow
  }

  pyramid.at(-1)!.push(0)
  for (let i = pyramid.length - 1; i > 0; i--) {
    const row = pyramid[i]
    const rowAbove = pyramid[i - 1]

    rowAbove.push(row.at(-1)! + rowAbove.at(-1)!)
  }

  return pyramid[0].at(-1)!
})

console.log(scores.reduce((a, b) => a + b, 0))
