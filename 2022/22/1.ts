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

const findNextEdge = (point: Point, dir: Dir): Point => {
  while (true) {
    const next = { x: point.x - dir.dx, y: point.y - dir.dy }
    if (!get(next) || get(next) === ' ') {
      return point
    }
    point = next
  }
}

const turn = (dir: Dir, dd: string): Dir => {
  if (dd === 'R') {
    return { dx: -dir.dy, dy: dir.dx }
  } else {
    return { dx: dir.dy, dy: -dir.dx }
  }
}

const log = (location: Point) => {
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
        nextCoord = findNextEdge(nextCoord, dir)
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
