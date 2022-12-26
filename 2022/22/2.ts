import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [unparsedMap, unparsedInstructions] = input.trimEnd().split('\n\n')

const instructions = unparsedInstructions
  .split(/(\d+\w)/gi)
  .filter(Boolean)
  .map((i) => {
    if (Number(i)) {
      return Number(i)
    }
    const n = Number(i.match(/\d+/)![0])
    const [dir] = i.slice(-1)
    return [n, dir]
  })
  .flat()

type Point = { x: number; y: number }
type Dir = { dx: number; dy: number }
let start: Point = { x: 0, y: 0 }

const map = unparsedMap.split('\n').map((l) => l.split(''))

outer: for (const [y, row] of map.entries()) {
  for (const [x, col] of row.entries()) {
    if (col !== ' ') {
      start = { x, y }
      break outer
    }
  }
}

const planeMappings = [
  { x1: 50, x2: 100, y1: 0, y2: 50 },
  { x1: 100, x2: 150, y1: 0, y2: 50 },
  { x1: 50, x2: 100, y1: 50, y2: 100 },
  { x1: 50, x2: 100, y1: 100, y2: 150 },
  { x1: 0, x2: 50, y1: 100, y2: 150 },
  { x1: 0, x2: 50, y1: 150, y2: 200 },
]

const nextPlanes: Array<{
  [key: string]: { next: number; dir: Dir; side: string; flip: boolean }
}> = [
  {
    L: { next: 4, dir: { dx: 1, dy: 0 }, flip: true, side: 'L' },
    U: { next: 5, dir: { dx: 1, dy: 0 }, flip: false, side: 'L' },
  },
  {
    U: { next: 5, dir: { dx: 0, dy: -1 }, flip: false, side: 'D' },
    R: { next: 3, dir: { dx: -1, dy: 0 }, flip: true, side: 'R' },
    D: { next: 2, dir: { dx: -1, dy: 0 }, flip: false, side: 'R' },
  },
  {
    L: { next: 4, dir: { dx: 0, dy: 1 }, flip: false, side: 'U' },
    R: { next: 1, dir: { dx: 0, dy: -1 }, flip: false, side: 'D' },
  },
  {
    R: { next: 1, dir: { dx: -1, dy: 0 }, flip: true, side: 'R' },
    D: { next: 5, dir: { dx: -1, dy: 0 }, flip: false, side: 'R' },
  },
  {
    U: {
      next: 2,
      side: 'L',
      dir: { dx: 1, dy: 0 },
      flip: false,
    },
    L: {
      next: 0,
      dir: { dx: 1, dy: 0 },
      flip: true,
      side: 'L',
    },
  },
  {
    L: {
      next: 0,
      dir: { dx: 0, dy: 1 },
      flip: false,
      side: 'U',
    },
    R: {
      next: 3,
      dir: { dx: 0, dy: -1 },
      flip: false,
      side: 'D',
    },
    D: {
      next: 1,
      dir: { dx: 0, dy: 1 },
      flip: false,
      side: 'U',
    },
  },
]

const dirLetters: Record<string, string> = {
  '0,-1': 'U',
  '0,1': 'D',
  '-1,0': 'L',
  '1,0': 'R',
}
const key = (dir: Dir) => `${dir.dx},${dir.dy}`

const findNextEdge = (point: Point, dir: Dir) => {
  const plane = getPlaneIdx(point)
  if (plane === undefined) {
    throw new Error('what')
  }
  let portion = -1
  const direction = dirLetters[key(dir)]
  if (direction === 'L' || direction === 'R') {
    portion = point.y - planeMappings[plane].y1
  } else {
    portion = point.x - planeMappings[plane].x1
  }
  const { next, dir: nextDir, flip, side } = nextPlanes[plane][direction]
  const { x1, x2, y1, y2 } = planeMappings[next]
  let nextPoint: Point = { x: 0, y: 0 }
  if (side === 'L' || side === 'R') {
    nextPoint = {
      x: side === 'L' ? x1 : x2 - 1,
      y: flip ? y2 - portion - 1 : y1 + portion,
    }
  } else {
    nextPoint = {
      x: flip ? x2 - portion - 1 : x1 + portion,
      y: side === 'U' ? y1 : y2 - 1,
    }
  }

  if (get(nextPoint) === '#') {
    return { point, dir: dir }
  } else {
    return { point: nextPoint, dir: nextDir }
  }
}

const turn = (dir: Dir, dd: string): Dir => {
  if (dd === 'R') {
    return { dx: -dir.dy, dy: dir.dx }
  } else {
    return { dx: dir.dy, dy: -dir.dx }
  }
}

const _log = (location: Point) => {
  console.log(
    map
      .map((r, y) =>
        r
          .map((c, x) => {
            if (x === location.x && y === location.y) {
              return 'X'
            }
            return c
          })
          .join('')
      )
      .join('\n'),
    '\n\n'
  )
}

const get = (point: Point) => map[point.y]?.[point.x]
const shouldWalk = (i: string | number): i is number => typeof i === 'number'
const shouldTurn = (i: string | number): i is string => typeof i === 'string'

const getPlaneIdx = (point: Point) => {
  for (const [i, mapping] of planeMappings.entries()) {
    const { x1, x2, y1, y2 } = mapping
    if (point.x >= x1 && point.x < x2 && point.y >= y1 && point.y < y2) {
      return i
    }
  }
}

let coord = start
let dir = { dx: 1, dy: 0 }
for (const instruction of instructions) {
  if (shouldWalk(instruction)) {
    for (let i = 0; i < instruction; i++) {
      let nextCoord = {
        x: coord.x + dir.dx,
        y: coord.y + dir.dy,
      }
      let next = get(nextCoord)

      if (!next || next === ' ') {
        const { point: nextPoint, dir: nextDir } = findNextEdge(coord, dir)
        if (nextPoint.x === coord.x && nextPoint.y === coord.y) {
          break
        }
        nextCoord = nextPoint
        dir = nextDir
        next = get(nextCoord)
      }

      if (next === '#') break

      coord = nextCoord
    }
  }
  if (shouldTurn(instruction)) {
    dir = turn(dir, instruction)
  }
}

const dirs = ['1,0', '0,1', '-1,0', '0,-1']
const row = coord.y + 1
const col = coord.x + 1
const facing = dirs.indexOf(`${dir.dx},${dir.dy}`)

console.log(row * 1000 + col * 4 + facing)
