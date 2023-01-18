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
  const angle = Math.atan2(y, x) - Math.PI / 2
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
  const visibleAsteroids = asteroids.reduce((visibleAsteroids, asteroid) => {
    const [ax, ay] = asteroid
    const dx = ax - x
    const dy = ay - y
    const angle = getAngle(dx, dy)

    const distance = getDistance(dx, dy)
    if (distance === 0) {
      return visibleAsteroids
    }

    if (
      visibleAsteroids[angle] === undefined ||
      visibleAsteroids[angle].distance < distance
    ) {
      visibleAsteroids[angle] = { asteroid, distance }
    }
    return visibleAsteroids
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
    if (asteroid.visible > max.visible) return asteroid
    return max
  })
  return bestAsteroid
}

const result = getBestAsteroid(grid)

const getAngleOrder = (grid: boolean[][], coord: Coord) => {
  const [x, y] = coord
  const asteroids = getAsteroids(grid)

  const angleOrder = asteroids
    .filter((asteroid) => {
      const [ax, ay] = asteroid
      return ax !== x || ay !== y
    })
    .reduce((angleOrder, asteroid) => {
      const [ax, ay] = asteroid
      const dx = x - ax
      const dy = y - ay
      const angle = getAngle(dx, dy)

      const distance = getDistance(dx, dy)

      angleOrder[angle] = angleOrder[angle] || []
      angleOrder[angle].push({ asteroid, distance })

      angleOrder[angle].sort((a, b) => {
        return a.distance - b.distance
      })
      return angleOrder
    }, {} as Record<number, { asteroid: Coord; distance: number }[]>)

  return angleOrder
}

const getNthAsteroid = (grid: boolean[][], coord: Coord, n: number) => {
  const angleOrder = getAngleOrder(grid, coord)

  let i = 1
  while (i <= n) {
    const angles = Object.keys(angleOrder)
      .map(Number)
      .sort((a, b) => a - b)

    for (const angle of angles) {
      const asteroids = angleOrder[angle]
      const asteroid = asteroids.shift()
      if (asteroids.length === 0) {
        delete angleOrder[angle]
      }

      if (i === n) {
        return asteroid
      }

      i++
    }
  }
}

const result2 = getNthAsteroid(grid, result.asteroid, 200)

if (result2 === undefined) {
  throw new Error('panic')
}

console.log(result2.asteroid[0] * 100 + result2.asteroid[1])
