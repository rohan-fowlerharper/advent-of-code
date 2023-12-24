import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const getPointOfIntersection = (t1: Trajectory, t2: Trajectory) => {
  const denominator = t1.v.vx * t2.v.vy - t1.v.vy * t2.v.vx

  // Check if the trajectories are parallel
  if (denominator === 0) {
    return null
  }

  const t1Intersection =
    ((t2.p.x - t1.p.x) * t2.v.vy - (t2.p.y - t1.p.y) * t2.v.vx) / denominator
  const t2Intersection =
    ((t2.p.x - t1.p.x) * t1.v.vy - (t2.p.y - t1.p.y) * t1.v.vx) / denominator

  // Check if the time of intersection is valid (i.e., the trajectories intersect in the future, not the past)
  if (t1Intersection < 0 || t2Intersection < 0) {
    return null
  }

  // Calculate the point of intersection
  const x = t1.p.x + t1.v.vx * t1Intersection
  const y = t1.p.y + t1.v.vy * t1Intersection

  if (x < BOUNDS.minX || x > BOUNDS.maxX) {
    return null
  }

  if (y < BOUNDS.minY || y > BOUNDS.maxY) {
    return null
  }

  return { x, y }
}

const trajectories = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [pointsRaw, velocitiesRaw] = l.split(' @ ')

    const points = pointsRaw.split(', ').map(Number)
    const velocities = velocitiesRaw.split(', ').map(Number)

    return {
      p: {
        x: points[0],
        y: points[1],
        z: points[2],
      },
      v: {
        vx: velocities[0],
        vy: velocities[1],
        vz: velocities[2],
      },
    }
  })

type Trajectory = {
  p: {
    x: number
    y: number
    z: number
  }
  v: {
    vx: number
    vy: number
    vz: number
  }
}

const BOUNDS = {
  minX: 200000000000000,
  maxX: 400000000000000,
  minY: 200000000000000,
  maxY: 400000000000000,
}

// const BOUNDS = {
//   minX: 7,
//   maxX: 27,
//   minY: 7,
//   maxY: 27,
// }

let count = 0
const seen = new Set<string>()
for (let i = 0; i < trajectories.length; i++) {
  for (let j = 0; j < trajectories.length; j++) {
    if (i === j) continue
    if (seen.has(`${j}-${i}`)) continue
    seen.add(`${i}-${j}`)

    const t1 = trajectories[i]
    const t2 = trajectories[j]

    const pointOfIntersection = getPointOfIntersection(t1, t2)

    if (pointOfIntersection) {
      count++
    }
  }
}

console.log(count)
