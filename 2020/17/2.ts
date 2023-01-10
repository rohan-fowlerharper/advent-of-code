import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const startingPositions = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

const CYCLES = 6

const maxX = startingPositions[0].length + CYCLES * 2
const maxY = startingPositions.length + CYCLES * 2
const maxZ = CYCLES * 2 + 1
const maxW = CYCLES * 2 + 1

const startingX =
  Math.floor(maxX / 2) - Math.floor(startingPositions[0].length / 2)
const startingY =
  Math.floor(maxY / 2) - Math.floor(startingPositions.length / 2)
const startingZ = Math.floor(maxZ / 2)
const startingW = Math.floor(maxW / 2)

const getNewGrid = () => {
  return Array.from({ length: maxW }, () =>
    Array.from({ length: maxZ }, () =>
      Array.from({ length: maxY }, () =>
        Array.from({ length: maxX }, () => '.')
      )
    )
  )
}

type Point = { x: number; y: number; z: number; w: number }

const getNeighbours = (p: Point) => {
  const neighbours: Point[] = []

  for (let x = p.x - 1; x <= p.x + 1; x++) {
    for (let y = p.y - 1; y <= p.y + 1; y++) {
      for (let z = p.z - 1; z <= p.z + 1; z++) {
        for (let w = p.w - 1; w <= p.w + 1; w++) {
          if (x === p.x && y === p.y && z === p.z && p.w === w) continue
          neighbours.push({ x, y, z, w })
        }
      }
    }
  }

  return neighbours
}

const getActiveNeighbours = (p: Point) => {
  return getNeighbours(p).filter((n) => grid[n.w]?.[n.z]?.[n.y]?.[n.x] === '#')
    .length
}

const willBeAlive = (p: Point, isAlive: boolean) => {
  const activeNeighbours = getActiveNeighbours(p)

  if (isAlive) {
    return activeNeighbours === 2 || activeNeighbours === 3
  } else {
    return activeNeighbours === 3
  }
}

const _printGrid = (grid: string[][][][], cycle: number) => {
  console.log('Cycle', cycle)
  for (let w = 0; w < maxW; w++) {
    if (grid[w].flat(2).filter((c) => c === '#').length === 0) continue
    for (let z = 0; z < maxZ; z++) {
      if (grid[w][z].flat().filter((c) => c === '#').length === 0) continue
      console.log('z', z - startingZ, 'w', w - startingW)
      for (let y = 0; y < maxY; y++) {
        console.log(grid[w][z][y].join(''))
      }
      console.log()
    }
  }
}

let grid = getNewGrid()

for (let y = 0; y < startingPositions.length; y++) {
  for (let x = 0; x < startingPositions[0].length; x++) {
    grid[startingW][startingZ][startingY + y][startingX + x] =
      startingPositions[y][x]
  }
}

for (let cycle = 0; cycle < CYCLES; cycle++) {
  const newGrid = getNewGrid()

  for (let w = 0; w < maxW; w++) {
    for (let z = 0; z < maxZ; z++) {
      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          const isAlive = grid[w][z][y][x] === '#'
          newGrid[w][z][y][x] = willBeAlive({ w, x, y, z }, isAlive) ? '#' : '.'
        }
      }
    }
  }

  grid = newGrid
}

const result = grid.flat(3).filter((c) => c === '#').length

console.log(result)
