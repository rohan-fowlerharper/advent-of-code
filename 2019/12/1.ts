import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Moon = typeof moons[number]
const moons = input
  .trimEnd()
  .split('\n')
  .map((m) => {
    const [x, y, z] = m.match(/-?\d+/g)!.map(Number)
    return { x, y, z, vx: 0, vy: 0, vz: 0 }
  })

console.log(moons)

const calculateChange = (moonA: Moon, moonB: Moon, d: 'x' | 'y' | 'z') => {
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

const calculateTotalEnergy = () => {
  let total = 0
  for (const moon of moons) {
    const pot = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z)
    const kin = Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz)
    total += pot * kin
  }
  return total
}

for (let i = 0; i < 1000; i++) {
  applyGravity()
  applyVelocity()
}

const result = calculateTotalEnergy()

console.log(result)
