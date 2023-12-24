import { init } from 'z3-solver'
import { readFileSync } from 'fs'
import path from 'path'

type Trajectory = {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

// z3-solver needs to run in node
async function run() {
  const { Context } = await init()

  const __filename = new URL(import.meta.url).pathname
  const __dirname = path.dirname(__filename)

  const input = readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')

  const trajectories: Trajectory[] = input
    .trimEnd()
    .split('\n')
    .map((l) => {
      const [pointsRaw, velocitiesRaw] = l.split(' @ ')
      const [x, y, z] = pointsRaw.split(', ').map(Number)
      const [vx, vy, vz] = velocitiesRaw.split(', ').map(Number)

      return {
        x,
        y,
        z,
        vx,
        vy,
        vz,
      }
    })

  const Z = Context('main')

  const solver = new Z.Solver()

  const fx = Z.Real.const('fx')
  const fy = Z.Real.const('fy')
  const fz = Z.Real.const('fz')

  const fvx = Z.Real.const('fvx')
  const fvy = Z.Real.const('fvy')
  const fvz = Z.Real.const('fvz')

  for (const [i, stone] of trajectories.entries()) {
    const t = Z.Real.const(`t${i}`)
    solver.add(fx.add(t.mul(fvx)).eq(t.mul(stone.vx).add(stone.x)))
    solver.add(fy.add(t.mul(fvy)).eq(t.mul(stone.vy).add(stone.y)))
    solver.add(fz.add(t.mul(fvz)).eq(t.mul(stone.vz).add(stone.z)))
  }

  if ((await solver.check()) !== 'sat') {
    throw new Error('no solution')
  }

  const model = solver.model()

  return Number(`${model.eval(fx.add(fy.add(fz)))}`)
}

run().then((result) => {
  console.log(result)
  process.exit(0)
})
