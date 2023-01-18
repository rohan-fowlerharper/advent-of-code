import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Dir = 'x' | 'y' | 'z'
type Moon = typeof moons[number]
const moons = input
  .trimEnd()
  .split('\n')
  .map((m) => {
    const [x, y, z] = m.match(/-?\d+/g)!.map(Number)
    return { x, y, z, vx: 0, vy: 0, vz: 0 }
  })

// console.log(moons)

const calculateChange = (moonA: Moon, moonB: Moon, d: Dir) => {
  if (moonA[d] < moonB[d]) {
    moonA[`v${d}`]++
    moonB[`v${d}`]--
  } else if (moonA[d] > moonB[d]) {
    moonA[`v${d}`]--
    moonB[`v${d}`]++
  }
}

const N_MOONS = moons.length

const applyGravity = () => {
  for (let i = 0; i < N_MOONS; i++) {
    const moon = moons[i]
    for (let j = i + 1; j < N_MOONS; j++) {
      // console.log(i, j)
      const other = moons[j]

      calculateChange(moon, other, 'x')
      calculateChange(moon, other, 'y')
      calculateChange(moon, other, 'z')
    }
  }
}

const applyVelocity = () => {
  for (const moon of moons) {
    moon.x += moon.vx
    moon.y += moon.vy
    moon.z += moon.vz
  }
}

const visited = [new Set<string>(), new Set<string>(), new Set<string>()]
const found: Array<string | null> = [null, null, null]
const dirs = ['x', 'y', 'z'] as const

const keyed = (d: Dir) => {
  return moons.map((m) => `${m[d]}:${m[`v${d}`]}`).join('_')
}

while (true) {
  applyGravity()
  applyVelocity()

  for (let d = 0; d < 3; d++) {
    if (found[d]) continue

    const key = keyed(dirs[d])

    if (visited[d].has(key)) found[d] = key
    else visited[d].add(key)
  }

  if (found.every((s) => s)) {
    break
  }
}

const [a, b, c] = visited.map((s) => s.size)

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

console.log(lcm(lcm(a, b), c))
