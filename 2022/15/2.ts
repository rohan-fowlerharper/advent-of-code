import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

type Point = { x: number; y: number }
type Signal = {
  s: Point
  b: Point
  md: number
}

const signals: Signal[] = lines.map((l) => {
  const [sensor, beacon] = l.split(': ').map((s) => {
    const [x, y] = s.split(', ').map(
      (s) =>
        s
          .split(' ')
          .filter((s) => s.startsWith('x=') || s.startsWith('y='))
          .map((s) => Number(s.split('=')[1]))[0]
    )
    return { x, y }
  })

  return {
    s: sensor,
    b: beacon,
    md: Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y),
  }
})

const isWithinRange = (signal: Signal, point: Point) =>
  Math.abs(signal.s.x - point.x) + Math.abs(signal.s.y - point.y) <= signal.md

const SIZE = 4000000
let unmarkedPoint: Point | null = null

sensors: for (const signal of signals) {
  for (
    let x = signal.s.x - signal.md - 1;
    x <= signal.s.x + signal.md + 1;
    x++
  ) {
    if (x < 0 || x > SIZE) continue

    const distance = Math.abs(signal.s.x - x) - 1 - signal.md

    const p1 = { x, y: signal.s.y - distance }
    const p2 = { x, y: signal.s.y + distance }

    const check = (p: Point) =>
      p.y >= 0 && p.y <= SIZE && !signals.some((s) => isWithinRange(s, p))

    if (check(p1)) unmarkedPoint = p1
    if (check(p2)) unmarkedPoint = p2

    if (unmarkedPoint !== null) break sensors
  }
}

if (!unmarkedPoint) throw new Error('Not found')
console.log(unmarkedPoint.x * 4000000 + unmarkedPoint.y)
