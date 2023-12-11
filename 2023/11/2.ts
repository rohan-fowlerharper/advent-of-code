import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

const emptyRowIndices = grid.reduce<number[]>((acc, row, i) => {
  if (!row.includes('#')) {
    acc.push(i)
  }
  return acc
}, [])

const emptyColIndices = grid[0].reduce<number[]>((acc, _, i) => {
  if (grid.map((row) => row[i]).every((cell) => cell === '.')) {
    acc.push(i)
  }
  return acc
}, [])

type StringPoint = `${number},${number}`
type Point = { row: number; col: number }

const key = (x: number, y: number) => `${x},${y}` as StringPoint

const dekey = (key: StringPoint): Point => {
  const [x, y] = key.split(',').map(Number)
  return { row: y, col: x }
}

const hashes = new Set<StringPoint>()

grid.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === '#') {
      hashes.add(key(x, y))
    }
  })
})

const paths = new Map<StringPoint, Map<StringPoint, number>>()
const FACTOR = 1000000

const isInRange = (a: number, b: number, c: number) => {
  return a >= Math.min(b, c) && a <= Math.max(b, c)
}

for (const hash of hashes) {
  const { row, col } = dekey(hash)
  const distances = new Map<StringPoint, number>()
  for (const otherHash of hashes) {
    if (paths.has(otherHash) || otherHash === hash) {
      continue
    }
    const { row: otherRow, col: otherCol } = dekey(otherHash)

    const adjustedEmptyColCount =
      emptyColIndices.filter((c) => isInRange(c, col, otherCol)).length * FACTOR
    const adjustedEmptyRowCount =
      emptyRowIndices.filter((r) => isInRange(r, row, otherRow)).length * FACTOR

    const distance =
      Math.abs(col - otherCol) -
      adjustedEmptyColCount / FACTOR +
      Math.abs(row - otherRow) -
      adjustedEmptyRowCount / FACTOR +
      adjustedEmptyColCount +
      adjustedEmptyRowCount

    distances.set(otherHash, distance)
  }
  paths.set(hash, distances)
}

const totalPaths = [...paths.values()].reduce((total, path) => {
  return total + [...path.values()].reduce((sum, v) => sum + v, 0)
}, 0)

console.log(totalPaths)
