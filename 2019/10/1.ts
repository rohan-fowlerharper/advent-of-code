import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split('').map((c) => c === '#'))

type Coord = [number, number]

const _print = (grid: boolean[][]) => {
  grid.forEach((row) => {
    console.log(row.map((c) => (c ? '#' : '.')).join(''))
  })
}

const getAngle = (x: number, y: number) => {
  const angle = Math.atan2(y, x)
  return angle < 0 ? angle + 2 * Math.PI : angle
}

const getDistance = (x: number, y: number) => {
  return Math.sqrt(x * x + y * y)
}

const getAsteroids = (grid: boolean[][]) => {
  const asteroids: Coord[] = []
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        asteroids.push([x, y])
      }
    })
  })
  return asteroids
}

const getVisibleAsteroids = (grid: boolean[][], coord: Coord) => {
  const [x, y] = coord
  const asteroids = getAsteroids(grid)
  const visibleAsteroids = asteroids.reduce((acc, asteroid) => {
    const [ax, ay] = asteroid
    const dx = ax - x
    const dy = ay - y
    const angle = getAngle(dx, dy)

    const distance = getDistance(dx, dy)
    if (distance === 0) {
      return acc
    }

    if (acc[angle] === undefined || acc[angle].distance < distance) {
      acc[angle] = { asteroid, distance }
    }
    return acc
  }, {} as Record<number, { asteroid: Coord; distance: number }>)
  return Object.values(visibleAsteroids)
}

const getBestAsteroid = (grid: boolean[][]) => {
  const asteroids = getAsteroids(grid)
  const visibleAsteroids = asteroids.map((asteroid) => {
    return {
      asteroid,
      visible: getVisibleAsteroids(grid, asteroid).length,
    }
  })
  const bestAsteroid = visibleAsteroids.reduce((max, asteroid) => {
    if (asteroid.visible > max.visible) {
      return asteroid
    }
    return max
  })
  return bestAsteroid
}

const result = getBestAsteroid(grid)
console.log(result)
