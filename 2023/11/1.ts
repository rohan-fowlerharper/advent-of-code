import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

const emptyRowIndices = grid.reduceRight((acc, row, i) => {
  if (!row.includes('#')) {
    acc.push(i)
  }
  return acc
}, [] as number[])

const emptyColIndices = grid[0].reduceRight((acc, _, i) => {
  const col = grid.map((row) => row[i])
  if (col.every((cell) => cell === '.')) {
    acc.push(i)
  }
  return acc
}, [] as number[])

emptyRowIndices.forEach((rowIdx) => {
  grid.splice(
    rowIdx + 1,
    0,
    grid[rowIdx].map(() => '.')
  )
})

emptyColIndices.forEach((colIdx) => {
  grid.forEach((row) => {
    row.splice(colIdx + 1, 0, '.')
  })
})

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

for (const hash of hashes) {
  const { row, col } = dekey(hash)
  const distances = new Map<StringPoint, number>()
  for (const otherHash of hashes) {
    if (paths.has(otherHash) || otherHash === hash) {
      continue
    }
    const { row: otherRow, col: otherCol } = dekey(otherHash)

    const distance = Math.abs(col - otherCol) + Math.abs(row - otherRow)

    distances.set(otherHash, distance)
  }
  paths.set(hash, distances)
}

const totalPaths = [...paths.values()].reduce((total, path) => {
  return total + [...path.values()].reduce((sum, v) => sum + v, 0)
}, 0)

console.log(totalPaths)
