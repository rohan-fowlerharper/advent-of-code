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
  Array.from({ length: WIDTH }, () => '.')
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
      if (matrix[coord.y + y + 1]?.[coord.x + x] === '.') return true

      return false
    })
  )

const addRock = (coord: { x: number; y: number }, pattern: Rock) => {
  for (const [y, row] of pattern.entries()) {
    for (const [x, char] of row.entries()) {
      if (char === 1) {
        matrix[coord.y + y][coord.x + x] = '#'
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
      matrix.unshift(Array.from({ length: WIDTH }, () => '.'))
      highestRock++
    }
  } else {
    while (highestRock > HEIGHT_FROM_ROCK + nextRockHeight) {
      matrix.shift()
      highestRock--
    }
  }
}

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
              currentRock[y - coord.y]?.[x - coord.x] === 1 ? '#' : c
            )
            .join('')
        )
        .join('\n'),
      '\n\n'
    )
  } else {
    console.log(matrix.map((row) => row.join('')).join('\n'), '\n\n')
  }
}

const getHighestRock = () => {
  for (let y = 0; y < matrix.length; y++) {
    if (matrix[y].some((c) => c === '#')) {
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
      if (matrix[coord.y + y]?.[coord.x + x + dx] === '.') return true

      return false
    })
  )
}

while (stoppedRocks < 2022) {
  const rock = getRock(stoppedRocks)
  const coord = { x: 2, y: 0 }

  while (true) {
    const dx = getWindDx()
    coord.x += canMoveRockX(coord, dx, rock) ? dx : 0

    if (canFall(coord, rock)) {
      coord.y += 1
    } else {
      addRock(coord, rock)
      stoppedRocks++
      break
    }
  }
}

drawMatrix()
console.log(matrix.length - getHighestRock())
