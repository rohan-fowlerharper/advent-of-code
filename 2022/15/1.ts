import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const blockers = new Set<number>()

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
  if (sensor.y === 2000000) blockers.add(sensor.x)
  if (beacon.y === 2000000) blockers.add(beacon.x)
  return {
    s: sensor,
    b: beacon,
    md: Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y),
  }
})

const Y = 2000000

const windows: Array<{ left: number; right: number }> = []

for (const signal of signals) {
  const distance = Math.abs(signal.s.y - Y)
  if (distance > signal.md) continue

  const left = signal.s.x - (signal.md - distance)
  const right = signal.s.x + (signal.md - distance)

  windows.push({ left, right })
}

let offset = 0
blockers.forEach((x) => {
  for (const window of windows) {
    if (x >= window.left && x <= window.right) {
      offset--
      break
    }
  }
})

windows.sort((a, b) => a.left - b.left)
const merged = [windows[0]]
for (let i = 1; i < windows.length; i++) {
  const { left, right } = windows[i]
  const { right: mRight } = merged[merged.length - 1]
  if (left <= mRight) {
    merged[merged.length - 1].right = Math.max(right, mRight)
  } else {
    merged.push({ left, right })
  }
}

console.log(
  merged.map(({ left, right }) => right - left + 1).reduce((a, b) => a + b, 0) +
    offset
)
