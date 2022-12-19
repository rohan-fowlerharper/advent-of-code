import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const wind = input.trimEnd()

type Rock = typeof patterns[PatternIndex]
const patterns = {
  '-': [[1, 1, 1, 1]],
  '+': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  L: [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  '|': [[1], [1], [1], [1]],
  '=': [
    [1, 1],
    [1, 1],
  ],
}
type PatternIndex = keyof typeof patterns
const patternOrder = ['-', '+', 'L', '|', '='] as const

const HEIGHT_FROM_ROCK = 3
const WIDTH = 7
const matrix = Array.from({ length: HEIGHT_FROM_ROCK + 1 }, () =>
  Array.from({ length: WIDTH }, () => 0)
)

let steps = 0
let stoppedRocks = 0

const getWindDx = () => {
  const result = wind[steps % wind.length] === '>' ? 1 : -1
  steps++
  return result
}
const getRock = (stoppedRocks: number) =>
  patterns[patternOrder[stoppedRocks % 5]]

const canFall = (coord: { x: number; y: number }, pattern: Rock) =>
  pattern.every((row, y) =>
    row.every((char, x) => {
      if (char === 0) return true
      if (matrix[coord.y + y + 1]?.[coord.x + x] === 0) return true

      return false
    })
  )

const addRock = (coord: { x: number; y: number }, pattern: Rock) => {
  for (const [y, row] of pattern.entries()) {
    for (const [x, char] of row.entries()) {
      if (char === 1) {
        matrix[coord.y + y][coord.x + x] = 1
      }
    }
  }
  addOrRemoveRows()
}

const addOrRemoveRows = () => {
  let highestRock = getHighestRock()
  const nextRock = getRock(stoppedRocks + 1)
  const nextRockHeight = nextRock.length
  if (highestRock < HEIGHT_FROM_ROCK + nextRockHeight) {
    while (highestRock < HEIGHT_FROM_ROCK + nextRockHeight) {
      matrix.unshift(Array.from({ length: WIDTH }, () => 0))
      highestRock++
    }
  } else {
    while (highestRock > HEIGHT_FROM_ROCK + nextRockHeight) {
      matrix.shift()
      highestRock--
    }
  }
}

// deno-lint-ignore no-unused-vars
const drawMatrix = (coord?: { x: number; y: number }, currentRock?: Rock) => {
  if (coord && currentRock) {
    console.log(
      wind
        .split('')
        .map((c, i) => (i === steps ? '#' : c))
        .join('')
    )
    console.log(
      matrix
        .map((row, y) =>
          row
            .map((c, x) =>
              currentRock[y - coord.y]?.[x - coord.x] || c ? '#' : '.'
            )
            .join('')
        )
        .join('\n'),
      '\n\n'
    )
  } else {
    console.log(
      matrix.map((row) => row.map((c) => (c ? '#' : '.')).join('')).join('\n'),
      '\n\n'
    )
  }
}

const getHighestRock = () => {
  for (let y = 0; y < matrix.length; y++) {
    if (matrix[y].some((c) => c === 1)) {
      return y
    }
  }
  return matrix.length - 1
}

const canMoveRockX = (
  coord: { x: number; y: number },
  dx: number,
  rock: Rock
) => {
  if (coord.x + dx < 0 || coord.x + dx + rock[0].length - 1 >= WIDTH) {
    return false
  }

  return rock.every((row, y) =>
    row.every((char, x) => {
      if (char === 0) return true
      if (matrix[coord.y + y]?.[coord.x + x + dx] === 0) return true

      return false
    })
  )
}

type Result = {
  rock: number
  height: number
  coord: { x: number; y: number }
}
const results: Result[] = []

// entirely arbitrary n
const N_ROCKS = 9000
while (stoppedRocks < N_ROCKS) {
  const rock = getRock(stoppedRocks)

  const coord = { x: 2, y: 0 }

  while (true) {
    const dx = getWindDx()
    coord.x += canMoveRockX(coord, dx, rock) ? dx : 0

    if (!canFall(coord, rock)) break

    coord.y += 1
  }

  addRock(coord, rock)
  results.push({
    rock: stoppedRocks % patternOrder.length,
    height: matrix.length - coord.y - rock.length - HEIGHT_FROM_ROCK,
    coord: coord,
  })
  stoppedRocks++
}

const emptyArrayInRange = (n: number) => new Array(n).fill(null)

let period = -1
const start = results.at(-1)!
for (let i = results.length - 2; i >= 0; i--) {
  const current = results.at(i)!

  if (current.rock === start.rock && current.coord.x === start.coord.x) {
    const possiblePeriod = results.length - i - 1

    const B = results.at(-possiblePeriod - 1)!
    const areSame = emptyArrayInRange(possiblePeriod).every((_, J) => {
      const a = results.at(-1 - J)!
      const b = results.at(-possiblePeriod - 1 - J)!

      return (
        a.rock === b.rock &&
        a.coord.x === b.coord.x &&
        start.height - a.height === B.height - b.height
      )
    })
    if (areSame) {
      period = possiblePeriod
      break
    }
  }
}

const periodHeight = start.height - results.at(-period - 1)!.height

let prefix = -1
for (let i = results.length - period - 1; i >= 0; i--) {
  const a = results.at(i + period)!
  const b = results.at(i)!

  if (a.coord.x !== b.coord.x || a.height !== b.height + periodHeight) {
    prefix = i + 1
    break
  }
}

const prefixHeight = results.at(prefix + period)!.height
const cycles = Math.floor((1000000000000 - prefix) / period) - 1
const remaining = (1000000000000 - prefix) % period
const remainingHeight =
  results.at(prefix + period + remaining)!.height - prefixHeight

const totalHeight = prefixHeight + cycles * periodHeight + remainingHeight

console.log(totalHeight)
